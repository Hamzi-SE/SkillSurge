import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendToken } from "../utils/sendToken.js";
import User from "../models/User.js";

export const register = catchAsyncError(async (req, res, next) => {
	const { name, email, password } = req.body;

	// const file = req.file;

	if (!name || !email || !password) return next(new ErrorHandler("Please enter all fields", 400));

	let user = await User.findOne({ email });

	if (user) return next(new ErrorHandler("User already exists", 409)); // 409 -> Conflict

	// Upload file on cloudinary

	user = await User.create({
		name,
		email,
		password,
		avatar: {
			public_id: "tempID",
			url: "tempURL",
		},
	});

	sendToken(res, user, "Registered successfully", 201);
});

export const login = catchAsyncError(async (req, res, next) => {
	const { email, password } = req.body;

	// const file = req.file;

	if (!email || !password) return next(new ErrorHandler("Please enter email and password", 400));

	const user = await User.findOne({ email }).select("+password");

	if (!user) return next(new ErrorHandler("Invalid email or password", 401));

	const isPasswordMatched = await user.comparePassword(password);

	if (!isPasswordMatched) return next(new ErrorHandler("Invalid email or password", 401));

	sendToken(res, user, `Welcome back, ${user.name}`, 200);
});

export const logout = catchAsyncError(async (req, res, next) => {
	res
		.status(200)
		.cookie("token", null, {
			expires: new Date(Date.now()),
			httpOnly: true,
			// secure: true,
			sameSite: "none",
		})
		.json({
			success: true,
			message: "Logged out successfully",
		});
});

export const getMyProfile = catchAsyncError(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	res.status(200).json({
		success: true,
		user,
	});
});
