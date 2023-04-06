import app from "./app.js";
import connectDatabase from "./config/database.js";
import cloudinary from "cloudinary";
import Stripe from "stripe";
import nodeCron from "node-cron";
import Stats from "./models/Stats.js";

// MongoDB connection
connectDatabase();

// Stripe configuration
export const stripe = new Stripe(process.env.STRIPE_API_SECRET, {
	apiVersion: "2020-08-27",
});

// Cloudinary configuration
cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
	api_key: process.env.CLOUDINARY_CLIENT_API,
	api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

// A cron job to generate new statistics on the second day of each month
const job = nodeCron.schedule("0 0 7 * *", async () => {
	try {
		await Stats.create({});
	} catch (error) {
		console.log(error);
	}
});

// Start the cron job
job.start();

// Starting the server
app.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});
