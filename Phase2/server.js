const express = require("express");
const cors = require("cors");
require("dotenv").config();
const interviewRoutes = require("./routes/interviewRoutes");
const authRoutes = require("./routes/authRoutes");
const groqRoutes = require("./routes/groqRoutes");
const judge0Routes = require("./routes/judge0Routes");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middleware/authMiddleware");

// Security Check: Validate critical environment variables on startup
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error("FATAL: JWT_SECRET is not configured or is too weak (must be >= 32 chars).");
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("FATAL: DATABASE_URL is not configured.");
  process.exit(1);
}
if (!process.env.GROQ_API_KEY) {
  console.error("FATAL: GROQ_API_KEY is not configured.");
  process.exit(1);
}

const app = express();
const evaluationRoutes = require("./routes/evaluationRoutes");

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max requests per window
});

const strictLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // for expensive AI operations
});

app.use(limiter);
app.use("/api/groq/", strictLimiter);
app.use("/api/evaluation/", strictLimiter);
app.use("/api/judge0/", strictLimiter);

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      process.env.FRONTEND_URL
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Public routes
app.use("/api/auth", authRoutes);

// Protected routes
app.use("/api/interviews", authMiddleware, interviewRoutes);
app.use("/api/groq", authMiddleware, groqRoutes);
app.use("/api/evaluation", authMiddleware, evaluationRoutes);
app.use("/api/judge0", authMiddleware, judge0Routes);

app.get("/", (req, res) => {
  res.send("InterviewMate AI Backend Running");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Global Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});