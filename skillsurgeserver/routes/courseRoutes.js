import express from "express";
import { addLecture, createCourse, deleteCourse, deleteLecture, getAllCourses, getCourseLectures } from "../controllers/courseController.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

// Get all courses without lectures
router.route("/courses").get(getAllCourses);

// Create new course - Admin only
router.route("/create-course").post(isAuthenticated, authorizeAdmin, singleUpload, createCourse);

// Add lecture, Delete course, Get course details
router
	.route("/course/:id")
	.get(isAuthenticated, getCourseLectures)
	.post(isAuthenticated, authorizeAdmin, singleUpload, addLecture)
	.delete(isAuthenticated, authorizeAdmin, deleteCourse);

// Delete lecture
router.route("/delete-lecture").delete(isAuthenticated, authorizeAdmin, deleteLecture);

export default router;
