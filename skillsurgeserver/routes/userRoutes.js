import express from "express";
import {
	addToPlaylist,
	changePassword,
	deleteMyProfile,
	deleteUser,
	forgotPassword,
	getAllUsers,
	getMyProfile,
	login,
	logout,
	register,
	removeFromPlaylist,
	resetPassword,
	updateProfile,
	updateProfilePicture,
	updateUserRole,
} from "../controllers/userController.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

// register a new user
router.route("/register").post(singleUpload, register);

// Login
router.route("/login").post(login);

// Logout
router.route("/logout").get(logout);

// Get my profile
router.route("/me").get(isAuthenticated, getMyProfile);

// Delete my profile
router.route("/me").delete(isAuthenticated, deleteMyProfile);

// Change password
router.route("/change-password").put(isAuthenticated, changePassword);

// Update profile
router.route("/update-profile").put(isAuthenticated, updateProfile);

// Update profile picture
router.route("/update-profile-picture").put(isAuthenticated, singleUpload, updateProfilePicture);

// Forgot password
router.route("/forgot-password").post(forgotPassword);

// Reset password
router.route("/reset-password/:token").put(resetPassword);

// Add to playlist
router.route("/add-to-playlist").post(isAuthenticated, addToPlaylist);

// Remove from playlist
router.route("/remove-from-playlist").delete(isAuthenticated, removeFromPlaylist);

// --- Admin Routes ---
// Get all users
router.route("/admin/users").get(isAuthenticated, authorizeAdmin, getAllUsers);

// Update user role & Delete user
router.route("/admin/user/:id").put(isAuthenticated, authorizeAdmin, updateUserRole).delete(isAuthenticated, authorizeAdmin, deleteUser);

export default router;
