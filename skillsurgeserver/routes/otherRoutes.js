import express from "express";
import { contact, courseRequest, getDashboardStats } from "../controllers/otherController.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Contact form
router.route("/contact").post(contact);

// Course request form
router.route("/course-request").post(courseRequest);

// Get admin dashboard routes
router.route("/admin/stats").get(isAuthenticated, authorizeAdmin, getDashboardStats);

export default router;
