import express from "express";
import { createCourse, getAllCourses } from "../controllers/courseController.js";

const router = express.Router();

// Get all courses without lectures
router.route("/courses").get(getAllCourses);

// Create new course - Admin only
router.route("/create-course").post(createCourse);

// Add lecture, Delete course, Get course details

// Delete lecture

export default router;
