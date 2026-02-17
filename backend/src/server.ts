// Server entry point
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import { mongoSanitize } from "./middleware/sanitize.middleware.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import { globalLimiter } from "./middleware/rateLimiter.middleware.js";

dotenv.config();

const app = express();

// Security middleware
app.use(helmet()); // Sets various HTTP security headers (CSP, X-Frame-Options, etc.)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Restrict to frontend origin
    credentials: true, // Allow cookies to be sent cross-origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json({ limit: "10kb" })); // Limit body size to prevent large payload attacks
app.use(cookieParser());
app.use(mongoSanitize); // Sanitize user input to prevent NoSQL injection (Express 5 compatible)
app.use(globalLimiter); // Global rate limiting: 100 requests per 15 minutes

// Routes
app.use("/auth", authRoutes);
app.use("/api", taskRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      /* console.log(`Server running on port ${PORT}`) */
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
