import express from "express";
import { addLecture, createCourse, getAllCourses, getCourseLectures } from "../controllers/courseController.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

// Get all courses without lectures
router.route("/courses").get(getAllCourses);

// Create new course - Admin only
router.route("/create-course").post(singleUpload, createCourse);

// Add lecture, Delete course, Get course details
router.route("/course/:id").get(getCourseLectures).post(singleUpload, addLecture);

// Delete lecture

export default router;
