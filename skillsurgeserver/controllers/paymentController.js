import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { stripe } from "../server.js";
import User from "../models/User.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const buySubscription = catchAsyncError(async (req, res, next) => {
	// const { stripeToken } = req.body;  ------- TODO
	const { email } = req.user;
	const { name } = req.user;
	const { role } = req.user;

	const user = await User.findById(req.user._id);

	// ----- Will receive stripeToken from frontend using Stripe Checkout Form ----- Todo

	// create customer without source
	const customer = await stripe.customers.create({
		email,
		name,
		description: role,
	});

	// create default payment as Card for this user
	const payment = await stripe.paymentMethods.create({
		type: "card",
		card: {
			number: "4242424242424242",
			exp_month: 12,
			exp_year: 2025,
			cvc: "314",
		},
	});

	// attach payment to customer
	await stripe.paymentMethods.attach(payment.id, {
		customer: customer.id,
	});

	// set default payment for customer
	await stripe.customers.update(customer.id, {
		invoice_settings: {
			default_payment_method: payment.id,
		},
	});

	// create subscription
	const subscription = await stripe.subscriptions.create({
		customer: customer.id,
		items: [{ price: "price_1MZgOZE8lXiiwU6cudF1JnqY" }],
		expand: ["latest_invoice.payment_intent"],
	});

	user.subscription.createdAt = Date.now();
	user.subscription.id = subscription.id;
	user.subscription.status = subscription.status;
	user.subscription.plan = "Pro Pack";
	user.subscription.payment_intent = subscription.latest_invoice.payment_intent.id;

	await user.save();

	res.status(201).json({
		success: true,
		subscription,
	});
});

// cancel subscription
export const cancelSubscription = catchAsyncError(async (req, res, next) => {
	const user = await User.findById(req.user._id);

	if (!user.subscription.id) {
		return next(new ErrorHandler("You do not have any subscription", 400));
	}

	const subscription = await stripe.subscriptions.del(user.subscription.id);

	user.subscription.id = undefined;
	user.subscription.status = "inactive";
	user.subscription.plan = undefined;
	user.subscription.createdAt = undefined;
	user.subscription.payment_intent = undefined;

	await user.save();

	res.status(200).json({
		success: true,
		subscription,
	});
});

// refund if he purchased subscription in the last 7 days only
export const refundSubscription = catchAsyncError(async (req, res, next) => {
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

	await user.save();

	res.status(200).json({
		success: true,
		message: refund
			? "Subscription cancelled, you will receive full refund within 7 days. Thank you"
			: `Subscription cancelled, you will not receive refund as refund can only be initiated within ${process.env.REFUND_DAYS} days of purchase. Thank you`,
	});
});
