import express from "express";
import {
	addToPlaylist,
	changePassword,
	forgotPassword,
	getMyProfile,
	login,
	logout,
	register,
	removeFromPlaylist,
	resetPassword,
	updateProfile,
	updateProfilePicture,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// To register a new user
router.route("/register").post(register);

// Login
router.route("/login").post(login);

// Logout
router.route("/logout").get(logout);

// Get my profile
router.route("/me").get(isAuthenticated, getMyProfile);

// Change password
router.route("/change-password").put(isAuthenticated, changePassword);

// Update profile
router.route("/update-profile").put(isAuthenticated, updateProfile);

// Update profile picture
router.route("/update-profile-picture").put(isAuthenticated, updateProfilePicture);

// Forgot password
router.route("/forgot-password").post(forgotPassword);

// Reset password
router.route("/reset-password/:token").put(resetPassword);

// Add to playlist
router.route("/add-to-playlist").post(isAuthenticated, addToPlaylist);

// Remove from playlist
router.route("/remove-from-playlist").delete(isAuthenticated, removeFromPlaylist);

export default router;
