import app from "./app.js";
import connectDatabase from "./config/database.js";
import cloudinary from "cloudinary";

// MongoDB connection
connectDatabase();

// Cloudinary configuration
cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
	api_key: process.env.CLOUDINARY_CLIENT_API,
	api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

app.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});
