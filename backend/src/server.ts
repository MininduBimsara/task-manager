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

// Allowed origins for CORS
const allowedOrigins = [
  process.env.FRONTEND_URL, // Production Vercel frontend URL
  "http://localhost:3000", // Local development
].filter(Boolean) as string[];

// Security middleware
app.use(helmet()); // Sets various HTTP security headers (CSP, X-Frame-Options, etc.)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
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

// Connect to DB on cold start
let isConnected = false;
const ensureDbConnected = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

// For local development: start the server
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  const startServer = async () => {
    try {
      await ensureDbConnected();
      app.listen(PORT, () => {
        /* console.log(`Server running on port ${PORT}`) */
      });
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  };
  startServer();
}

// Export for Vercel serverless
export { app, ensureDbConnected };
export default app;
