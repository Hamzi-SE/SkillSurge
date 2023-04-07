import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
import Stats from "../models/Stats.js";

export const contact = catchAsyncError(async (req, res, next) => {
	const { name, email, message } = req.body;

	if (!name || !email || !message) return next(new ErrorHandler("All fields are mandatory", 400));

	const to = process.env.MY_MAIL;
	const subject = "Contact From Skill Surge";
	const html = `
        <h1>Contact Details</h1>
        <ul>
            <li>Name: ${name}</li>
            <li>Email: ${email}</li>
        </ul>
        <h1>Message</h1>
        <p>${message}</p>
    `;

	await sendEmail(to, subject, html);

	res.status(200).json({
		success: true,
		message: "Your message has been sent.",
	});
});

export const courseRequest = catchAsyncError(async (req, res, next) => {
	const { name, email, course } = req.body;

	if (!name || !email || !course) return next(new ErrorHandler("All fields are mandatory", 400));

	const to = process.env.MY_MAIL;
	const subject = "Course Request From Skill Surge";
	const html = `
        <h1>Contact Details</h1>
        <ul>
            <li>Name: ${name}</li>
            <li>Email: ${email}</li>
        </ul>
        <h1>Request</h1>
        <p>${course}</p>
    `;

	await sendEmail(to, subject, html);

	res.status(200).json({
		success: true,
		message: "Your request has been sent.",
	});
});

export const createStats = catchAsyncError(async (req, res, next) => {
	const stats = await Stats.find({}).sort({ createdAt: "desc" }).limit(1);

	const usersCount = stats[0].users;
	const subscriptionsCount = stats[0].subscriptions;
	const viewsCount = stats[0].views;

	const newStats = await Stats.create({
		users: usersCount,
		subscriptions: subscriptionsCount,
		views: viewsCount,
	});

	res.status(200).json({
		success: true,
		newStats,
	});
});

export const getDashboardStats = catchAsyncError(async (req, res, next) => {
	const stats = await Stats.find({}).sort({ createdAt: "desc" }).limit(12);

	const statsData = [];

	const requiredSize = 12 - stats.length;

	if (requiredSize > 0) {
		for (let i = 0; i < requiredSize; i++) {
			statsData.push({
				users: 0,
				subscriptions: 0,
				views: 0,
			});
		}

		for (let i = stats.length; i > 0; i--) {
			statsData.push({
				users: stats[i - 1].users,
				subscriptions: stats[i - 1].subscriptions,
				views: stats[i - 1].views,
				updatedAt: stats[i - 1].updatedAt,
			});
		}
	}

	if (requiredSize === 0) {
		stats.forEach((stat) => {
			statsData.push({
				users: stat.users,
				subscriptions: stat.subscriptions,
				views: stat.views,
				updatedAt: stat.updatedAt,
			});
		});
	}

	const usersCount = statsData[11].users;
	const subscriptionsCount = statsData[11].subscriptions;
	const viewsCount = statsData[11].views;

	let usersPercentage = 0;
	let subscriptionsPercentage = 0;
	let viewsPercentage = 0;

	let usersProfit = true;
	let subscriptionsProfit = true;
	let viewsProfit = true;

	if (statsData[10].users === 0) usersPercentage = usersCount * 100;
	if (statsData[10].subscriptions === 0) subscriptionsPercentage = subscriptionsCount * 100;
	if (statsData[10].views === 0) viewsPercentage = viewsCount * 100;
	else {
		const difference = {
			users: statsData[11].users - statsData[10].users,
			subscriptions: statsData[11].subscriptions - statsData[10].subscriptions,
			views: statsData[11].views - statsData[10].views,
		};

		usersPercentage = (difference.users / statsData[10].users) * 100;
		subscriptionsPercentage = (difference.subscriptions / statsData[10].subscriptions) * 100;
		viewsPercentage = (difference.views / statsData[10].views) * 100;

		if (usersPercentage < 0) usersProfit = false;
		if (subscriptionsPercentage < 0) subscriptionsProfit = false;
		if (viewsPercentage < 0) viewsProfit = false;

		usersPercentage = usersPercentage.toFixed(2);
		subscriptionsPercentage = subscriptionsPercentage.toFixed(2);
		viewsPercentage = viewsPercentage.toFixed(2);
	}

	res.status(200).json({
		success: true,
		stats: statsData,
		usersCount,
		subscriptionsCount,
		viewsCount,
		usersProfit,
		subscriptionsProfit,
		viewsProfit,
		usersPercentage,
		subscriptionsPercentage,
		viewsPercentage,
	});
});
