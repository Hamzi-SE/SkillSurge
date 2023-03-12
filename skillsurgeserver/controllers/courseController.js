import Course from "../models/Course.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";
import Stats from "../models/Stats.js";
import User from "../models/User.js";

export const getAllCourses = catchAsyncError(async (req, res, next) => {
	const keyword = req.query.keyword || "";
	const category = req.query.category || "";

	const courses = await Course.find({
		title: {
			$regex: keyword,
			$options: "i",
		},
		category: {
			$regex: category,
			$options: "i",
		},
	}).select("-lectures");

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

	// Update views (but not if admin opens it)
	if (req.user.role !== "admin") {
		course.views += 1;
	}

	await course.save();

	res.status(200).json({
		success: true,
		lectures: course.lectures,
	});
});

// Max video size 100mb
export const addLecture = catchAsyncError(async (req, res, next) => {
	const { id } = req.params;
	const { title, description } = req.body;
	const file = req.file;

	if (!title || !description || !file) return next(new ErrorHandler("Please fill all fields", 400));

	if (title.length < 4) {
		return next(new ErrorHandler("Lecture title must be at least 4 characters", 400));
	}
	if (description.length < 20) {
		return next(new ErrorHandler("Lecture description must be at least 20 characters", 400));
	}

	const course = await Course.findById(id);

	if (!course) return next(new ErrorHandler("Course not found", 404));

	const fileUri = getDataUri(file);

	const fileSize = file.size / 1000000; // get the file size in MB

	if (fileSize > 100) return next(new ErrorHandler("Video size should be less than 100 MB", 400));

	const result = await cloudinary.v2.uploader.upload(fileUri.content, {
		resource_type: "video",
		folder: "skillsurge",
	});

	const video = {
		public_id: result.public_id,
		url: result.secure_url,
	};

	course.lectures.push({
		title,
		description,
		video,
	});

	course.numOfVideos = course.lectures.length;

	await course.save();

	res.status(200).json({
		success: true,
		message: "Lecture added in course successfully",
	});
});

export const deleteCourse = catchAsyncError(async (req, res, next) => {
	const course = await Course.findById(req.params.id);

	if (!course) return next(new ErrorHandler("Course not found", 404));

	// DELETE ITS POSTER AND ALL VIDEOS
	await cloudinary.v2.uploader.destroy(course.poster.public_id);
	course.lectures.forEach(async (lecture) => {
		await cloudinary.v2.uploader.destroy(lecture.video.public_id, {
			resource_type: "video",
		});
	});

	await course.remove();

	res.status(200).json({
		success: true,
		message: "Course deleted successfully",
	});
});

export const deleteLecture = catchAsyncError(async (req, res, next) => {
	const { courseId, lectureId } = req.query;

	const course = await Course.findById(courseId);

	if (!course) return next(new ErrorHandler("Course not found", 404));

	// check if the lecture exists in the course
	const lecture = course.lectures.find((lecture) => lecture._id.toString() === lectureId);

	if (!lecture) return next(new ErrorHandler("Lecture not found", 404));

	// DELETE ITS VIDEO
	await cloudinary.v2.uploader.destroy(lecture.video.public_id, {
		resource_type: "video",
	});

	await lecture.remove();

	course.numOfVideos = course.lectures.length;

	await course.save();

	res.status(200).json({
		success: true,
		message: "Lecture deleted successfully",
	});
});

// Watcher (real-time data check in database and triggered when changed)
Course.watch().on("change", async () => {
	const stats = await Stats.find({}).sort({ createdAt: "desc" }).limit(1);

	const totalSubscribers = await User.countDocuments({ "subscription.status": "active" });
	const courses = await Course.find({});

	let totalViews = 0;

	courses.forEach((course) => {
		totalViews += course.views;
	});

	stats[0].views = totalViews;
	stats[0].createdAt = new Date(Date.now());

	await stats[0].save();
});
