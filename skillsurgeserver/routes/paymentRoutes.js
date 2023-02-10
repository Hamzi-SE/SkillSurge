import express from "express";
import { buySubscription, cancelSubscription, refundSubscription } from "../controllers/paymentController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// payment routes
router.route("/subscribe").get(isAuthenticated, buySubscription);

// cancel subscription
router.route("/cancel-subscription").delete(isAuthenticated, cancelSubscription);

// refund
router.route("/refund-subscription").delete(isAuthenticated, refundSubscription);

export default router;
