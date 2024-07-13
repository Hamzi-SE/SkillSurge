import { catchAsyncError } from '../middlewares/catchAsyncError.js'
import ErrorHandler from '../utils/ErrorHandler.js'
import { sendToken } from '../utils/sendToken.js'
import User from '../models/User.js'
import Stats from '../models/Stats.js'
import Course from '../models/Course.js'
import { sendEmail } from '../utils/sendEmail.js'
import crypto from 'crypto'
import cloudinary from 'cloudinary'
import getDataUri from '../utils/dataUri.js'
import { stripe } from '../server.js'

export const register = catchAsyncError(async (req, res, next) => {
	const { name, email, password } = req.body
	const file = req.file

	if (!name || !email || !password || !file) return next(new ErrorHandler('Please enter all fields', 400))

	let user = await User.findOne({ email })

	if (user) return next(new ErrorHandler('User already exists', 409)) // 409 -> Conflict

	const fileUri = getDataUri(file)

	const result = await cloudinary.v2.uploader.upload(fileUri.content, {
		folder: 'skillsurge',
	})

	const avatar = {
		public_id: result.public_id,
		url: result.secure_url,
	}

	user = await User.create({
		name,
		email,
		password,
		avatar,
	})

	sendToken(res, user, 'Registered successfully', 201)
})

export const login = catchAsyncError(async (req, res, next) => {
	const { email, password } = req.body

	if (!email || !password) return next(new ErrorHandler('Please enter email and password', 400))

	const user = await User.findOne({ email }).select('+password')

	if (!user) return next(new ErrorHandler('Invalid email or password', 401))

	const isPasswordMatched = await user.comparePassword(password)

	if (!isPasswordMatched) return next(new ErrorHandler('Invalid email or password', 401))

	sendToken(res, user, `Welcome back, ${user.name}`, 200)
})

export const logout = catchAsyncError(async (req, res, next) => {
	res
		.status(200)
		.cookie('token', null, {
			expires: new Date(Date.now()),
			httpOnly: true,
			secure: true,
			sameSite: 'none',
		})
		.json({
			success: true,
			message: 'Logged out successfully',
		})
})

export const getMyProfile = catchAsyncError(async (req, res, next) => {
	const user = await User.findById(req.user.id)

	res.status(200).json({
		success: true,
		user,
	})
})

export const deleteMyProfile = catchAsyncError(async (req, res, next) => {
	const user = await User.findById(req.user.id)

	if (user.avatar.public_id) {
		await cloudinary.v2.uploader.destroy(user.avatar.public_id)
	}

	// Cancel subscription
	if (user.subscription && user.subscription.status === 'active') {
		await stripe.subscriptions.del(user.subscription.id)
	}

	await user.remove()

	res
		.status(200)
		.cookie('token', null, {
			expires: new Date(Date.now()),
			httpOnly: true,
			secure: true,
			sameSite: 'none',
		})
		.json({
			success: true,
			message: 'Your account has been deleted successfully',
		})
})

export const changePassword = catchAsyncError(async (req, res, next) => {
	const { oldPassword, newPassword } = req.body

	if (!oldPassword || !newPassword) return next(new ErrorHandler('Please enter all fields', 400))

	const user = await User.findById(req.user._id).select('+password')

	const isPasswordMatched = await user.comparePassword(oldPassword)

	if (!isPasswordMatched) return next(new ErrorHandler('Old password is incorrect', 400))

	user.password = newPassword

	await user.save()

	res.status(200).json({
		success: true,
		message: 'Password changed successfully',
	})
})

export const updateProfile = catchAsyncError(async (req, res, next) => {
	const { name, email } = req.body

	const user = await User.findById(req.user._id)

	if (email && user.email !== email) {
		const emailExists = await User.findOne({ email })

		if (emailExists) return next(new ErrorHandler('Email already exists', 400))

		user.email = email
	}

	if (name) user.name = name

	await user.save()

	res.status(200).json({
		success: true,
		message: 'Profile updated successfully',
	})
})

export const updateProfilePicture = catchAsyncError(async (req, res, next) => {
	const user = await User.findById(req.user._id)

	const file = req.file

	if (!file) return next(new ErrorHandler('Please upload a file', 400))

	const fileUri = getDataUri(file)

	// delete old profile pic
	if (user.avatar.public_id) {
		await cloudinary.v2.uploader.destroy(user.avatar.public_id)
	}

	const result = await cloudinary.v2.uploader.upload(fileUri.content, {
		folder: 'skillsurge',
	})

	user.avatar = {
		public_id: result.public_id,
		url: result.secure_url,
	}

	await user.save()

	res.status(200).json({
		success: true,
		message: 'Profile picture updated successfully',
	})
})

export const forgotPassword = catchAsyncError(async (req, res, next) => {
	const { email } = req.body

	if (!email) return next(new ErrorHandler('Please enter email', 400))

	const user = await User.findOne({ email })

	if (!user) return next(new ErrorHandler(`User not found with ${email} in the database`, 404))

	const resetToken = user.getResetPasswordToken()

	await user.save({ validateBeforeSave: false })

	const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

	const message = `
		<div style="text-align: center;">
			<a href=${process.env.FRONTEND_URL}><img src="https://i.ibb.co/m9wK4S3/Logo.png" style="width: 50%;" alt="Logo" border="0"></a>
			<h1>You have requested a password reset</h1>
			<p>Please go to the following link to reset your password</p>
			<a href=${resetPasswordUrl} target="_blank">Click here to reset your password</a>
			<p>If you have not requested this email, then ignore it.</p>
			<p>Thank you</p>
			<p>Regards,</p>
			<i>Team Skill Surge</i>
			<i>${process.env.FRONTEND_URL}</i>
		</div>
	`

	// send token to user's email
	try {
		await sendEmail({
			email: user.email,
			subject: 'Skill Surge Password Recovery',
			message,
		})

		res.status(200).json({
			success: true,
			message: `Password reset link sent to ${email}`,
		})
	} catch (error) {
		user.resetPasswordToken = undefined
		user.resetPasswordExpire = undefined

		await user.save({ validateBeforeSave: false })

		return next(new ErrorHandler(error?.message, 500))
	}
})

export const resetPassword = catchAsyncError(async (req, res, next) => {
	const { token } = req.params

	const { password } = req.body

	if (!password) return next(new ErrorHandler('Please enter password', 400))

	const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')

	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now() },
	})

	if (!user) return next(new ErrorHandler('Password reset token is invalid or has expired', 401))

	user.password = password

	user.resetPasswordToken = undefined
	user.resetPasswordExpire = undefined

	await user.save()

	res.status(200).json({
		success: true,
		message: `Your password has been successfully reset. Please use your new password to access your account.`,
	})
})

export const addToPlaylist = catchAsyncError(async (req, res, next) => {
	const user = await User.findById(req.user._id)
	const course = await Course.findById(req.body.id)

	if (!course) return next(new ErrorHandler('Course not found', 404))

	const isCourseInPlaylist = user.playlist.find(item => item.course.toString() === course._id.toString())

	if (isCourseInPlaylist) return next(new ErrorHandler('Course already in playlist', 400))

	user.playlist.push({
		course: course._id,
		poster: course.poster.url,
	})

	await user.save()

	res.status(200).json({
		success: true,
		message: 'Course added to playlist',
	})
})

export const removeFromPlaylist = catchAsyncError(async (req, res, next) => {
	const user = await User.findById(req.user._id)
	const course = await Course.findById(req.query.id)

	if (!course) return next(new ErrorHandler('Course not found', 404))

	const isCourseInPlaylist = user.playlist.find(item => item.course.toString() === course._id.toString())

	if (!isCourseInPlaylist) return next(new ErrorHandler('Course not in playlist', 400))

	user.playlist = user.playlist.filter(item => item.course.toString() !== course._id.toString())

	await user.save()

	res.status(200).json({
		success: true,
		message: 'Course removed from playlist',
	})
})

// --- Admin Controllers ---
export const getAllUsers = catchAsyncError(async (req, res, next) => {
	const users = await User.find()

	res.status(200).json({
		success: true,
		users,
	})
})

export const updateUserRole = catchAsyncError(async (req, res, next) => {
	const user = await User.findById(req.params.id)

	if (!user) return next(new ErrorHandler('User not found', 404))

	if (user._id.toString() === req.user._id.toString())
		return next(new ErrorHandler('You can not update your own role', 400))

	if (user.role === 'user') user.role = 'admin'
	else user.role = 'user'

	await user.save()

	res.status(200).json({
		success: true,
		message: `${user.name}'s role updated successfully`,
	})
})

export const deleteUser = catchAsyncError(async (req, res, next) => {
	const user = await User.findById(req.params.id)

	if (!user) return next(new ErrorHandler('User not found', 404))

	if (user._id.toString() === req.user._id.toString())
		return next(new ErrorHandler('You can not delete your own account', 400))

	if (user.avatar.public_id) {
		await cloudinary.v2.uploader.destroy(user.avatar.public_id)
	}

	// Cancel User's Subscription
	if (user.subscription && user.subscription.status === 'active') {
		await stripe.subscriptions.del(user.subscription.id)
	}

	await user.remove()

	res.status(200).json({
		success: true,
		message: `${user.name}'s account deleted successfully`,
	})
})

// Watcher (real-time data check in database and triggered when changed)
User.watch().on('change', async () => {
	const stats = await Stats.find({}).sort({ createdAt: 'desc' }).limit(1)

	const totalSubscribers = await User.countDocuments({ 'subscription.status': 'active' })
	const totalUsers = await User.countDocuments()

	stats[0].subscriptions = totalSubscribers
	stats[0].users = totalUsers
	stats[0].updatedAt = new Date(Date.now())

	await stats[0].save()
})
