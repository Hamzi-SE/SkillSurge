import express from "express";
import { config } from "dotenv";
import ErrorMiddleware from "./middlewares/Error.js";

// dotenv config
config({ path: "./config/config.env" });

const app = express();

// Importing & Using Routes
import courseRoutes from "./routes/courseRoutes.js";
import userRoutes from "./routes/userRoutes.js";

app.use("/api/v1", courseRoutes);
app.use("/api/v1", userRoutes);

// Error Handler (use at the end)
app.use(ErrorMiddleware);

export default app;
