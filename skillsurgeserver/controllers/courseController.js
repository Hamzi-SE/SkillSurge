import Course from "../models/Course.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";

export const getAllCourses = catchAsyncError(async (req, res, next) => {
	const courses = await Course.find().select("-lectures");
	res.status(200).json({
		success: true,
		courses,
	});
});

export const createCourse = catchAsyncError(async (req, res, next) => {
	const { title, description, category, createdBy } = req.body;

	if (!title || !description || !category || !createdBy) return next(new ErrorHandler("Please enter all fields", 400));

	const file = req.file;

	const fileUri = getDataUri(file);

	const result = await cloudinary.v2.uploader.upload(fileUri.content, {
		folder: "skillsurge",
	});

	await Course.create({
		title,
		description,
		category,
		createdBy,
		poster: {
			public_id: result.public_id,
			url: result.secure_url,
		},
	});

	res.status(201).json({
		success: true,
		message: "Course created successfully. You can add lectures now.",
	});
});

export const getCourseLectures = catchAsyncError(async (req, res, next) => {
	const course = await Course.findById(req.params.id);

	if (!course) return next(new ErrorHandler("Course not found", 404));

	course.views += 1;

	await course.save();

	res.status(200).json({
		success: true,
		lectures: course.lectures,
	});
});

export const addLecture = catchAsyncError(async (req, res, next) => {
	const { id } = req.params;
	const { title, description } = req.body;

	// const file = req.file;

	const course = await Course.findById(id);

	if (!course) return next(new ErrorHandler("Course not found", 404));

	// upload to cloudinary
	const result = await cloudinary.v2.uploader.upload(req.file.path, {
		folder: "skillsurge",
	});

	const video = {
		public_id: result.public_id,
		url: result.secure_url,
	};

	if (!title || !description || !video) return next(new ErrorHandler("Please enter all fields", 400));

	course.lectures.push({
		title,
		description,
		video,
	});

	course.numOfvideos = course.lectures.length;

	await course.save();

	res.status(200).json({
		success: true,
		message: "Lecture added in course successfully",
	});
});
