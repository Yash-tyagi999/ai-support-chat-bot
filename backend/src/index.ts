import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import chatRouter from "./routes/chat.routes";
import { Logger } from "./utils/logger";

// Initialize environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Apply rate limiting middleware to prevent API abuse and spamming
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per 15 minutes
  message: {
    error: "Too many requests. Please slow down and try again in 15 minutes.",
  },
  standardHeaders: true, // Return rate limit info in standard headers
  legacyHeaders: false, // Disable deprecated headers
});

// Enable CORS for all origins in development and production
app.use(cors());

// Body parser middleware
app.use(express.json());

// Register modular routers with rate-limiter protection
app.use("/chat", chatLimiter, chatRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date(),
    environment: process.env.NODE_ENV || "development",
    llmConfigured: !!process.env.OPENAI_API_KEY,
  });
});

// Catch-all 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found." });
});

// Global internal error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  Logger.error("Unhandled Server Error:", err);
  res.status(500).json({
    error: "An unexpected error occurred on the server.",
  });
});

app.listen(PORT, () => {
  Logger.info(`Server successfully listening on http://localhost:${PORT}`);
});
