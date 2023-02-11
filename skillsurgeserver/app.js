import express from "express";
import { config } from "dotenv";
import ErrorMiddleware from "./middlewares/Error.js";
import cookieParser from "cookie-parser";

// dotenv config
config({ path: "./config/config.env" });

const app = express();

// Using Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Importing & Using Routes
import courseRoutes from "./routes/courseRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import otherRoutes from "./routes/otherRoutes.js";

app.use("/api/v1", courseRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", paymentRoutes);
app.use("/api/v1", otherRoutes);

// Error Handler (use at the end)
app.use(ErrorMiddleware);

export default app;
