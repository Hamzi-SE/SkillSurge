import express from "express";
import { buySubscription, cancelSubscription, getPublishableKey, refundSubscription } from "../controllers/paymentController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// get Stripe publishable key
router.route("/stripe-publishable-key").get(getPublishableKey);

// payment routes
router.route("/subscribe").post(isAuthenticated, buySubscription);

// cancel subscription
router.route("/cancel-subscription").delete(isAuthenticated, cancelSubscription);

// refund
router.route("/refund-subscription").delete(isAuthenticated, refundSubscription);

export default router;
