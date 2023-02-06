import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
	const { token } = req.cookies;

	if (!token) return next(new ErrorHandler("Login first to access this resource", 401));

	const decoded = jwt.verify(token, process.env.JWT_SECRET);

	req.user = await User.findById(decoded._id); // we assigned _id when signing the JWT

	next();
});