import express from "express";
import { buySubscription, cancelSubscription, checkAndUpdateSubscriptionState, getPublishableKey } from "../controllers/paymentController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// get Stripe publishable key
router.route("/stripe-publishable-key").get(getPublishableKey);

// payment routes
router.route("/subscribe").post(isAuthenticated, buySubscription);

// check subscription
router.route("/check-subscription").get(isAuthenticated, checkAndUpdateSubscriptionState);

// cancel subscription
router.route("/cancel-subscription").delete(isAuthenticated, cancelSubscription);

export default router;
