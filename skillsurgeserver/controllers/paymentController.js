import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { stripe } from "../server.js";
import User from "../models/User.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// get Stripe publishable key
export const getPublishableKey = catchAsyncError(async (req, res, next) => {
	res.status(200).json({
		success: true,
		stripePublishableKey: process.env.STRIPE_API_KEY,
	});
});

export const buySubscription = catchAsyncError(async (req, res, next) => {
	const { email, name, paymentMethod } = req.body;

	const user = await User.findById(req.user._id);

	if (user.subscription.id && user.subscription.status === "active") {
		return next(new ErrorHandler("You already have a subscription", 400));
	}

	// create customer with source
	const customer = await stripe.customers.create({
		email,
		name,
		payment_method: paymentMethod,
		invoice_settings: {
			default_payment_method: paymentMethod,
		},
		description: "Skill Surge Pro Pack",
	});

	// create subscription
	const subscription = await stripe.subscriptions.create({
		customer: customer.id,
		items: [{ price: "price_1MgBDAE8lXiiwU6cKWyKR5L3" }],
		payment_settings: {
			payment_method_types: ["card"],
			save_default_payment_method: "on_subscription",
		},
		expand: ["latest_invoice.payment_intent"],
	});

	if (!customer || !subscription) {
		return res.redirect(`${process.env.FRONTEND_URL}/payment-fail`);
	}

	// update user subscription details
	user.subscription.createdAt = Date.now();
	user.subscription.id = subscription.id;
	user.subscription.status = subscription.status;
	user.subscription.plan = "Pro Pack";
	user.subscription.payment_intent = subscription.latest_invoice.payment_intent.id;

	await user.save();

	res.status(201).json({
		success: true,
		message: "Pro Pack Subscription Successful",
		clientSecret: subscription.latest_invoice.payment_intent.client_secret,
		subscriptionId: subscription.id,
	});
});

// check and update subscription status
export const checkAndUpdateSubscriptionState = catchAsyncError(async (req, res, next) => {
	const user = await User.findById(req.user._id);

	if (!user.subscription.id) {
		return next(new ErrorHandler("You do not have any subscription", 400));
	}

	const subscription = await stripe.subscriptions.retrieve(user.subscription.id);

	// check if the 3ds failed
	if (subscription.status !== "active") {
		user.subscription.status = subscription.status;

		await user.save();

		return next(new ErrorHandler("Payment failed, please try again", 400));
	}

	user.subscription.status = subscription.status;

	await user.save();

	res.status(200).json({
		success: true,
		message: "Subscription Status Updated successfully",
	});
});

// cancel subscription
export const cancelSubscription = catchAsyncError(async (req, res, next) => {
	const user = await User.findById(req.user._id);

	if (!user.subscription.id) {
		return next(new ErrorHandler("You do not have any subscription", 400));
	}

	let refund = false;

	// check the gap in the purchase of subscription
	const diffDays = Math.ceil(Math.abs(Date.now() - user.subscription.createdAt) / (1000 * 60 * 60 * 24));

	if (diffDays <= process.env.REFUND_DAYS) {
		refund = true;
		await stripe.refunds.create({
			payment_intent: user.subscription.payment_intent,
		});
		user.subscription.payment_intent = undefined;
	}

	await stripe.subscriptions.del(user.subscription.id);

	user.subscription.id = undefined;
	user.subscription.status = "inactive";
	user.subscription.plan = undefined;
	user.subscription.createdAt = undefined;
	user.subscription.payment_intent = undefined;

	await user.save();

	res.status(200).json({
		success: true,
		message: refund
			? "Subscription cancelled, you will receive full refund within 5 - 10 days. Thank you!"
			: `Subscription cancelled, you will not receive refund as refund can only be initiated within ${process.env.REFUND_DAYS} days of purchase. Thank you!`,
	});
});
