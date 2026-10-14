
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport");
const path = require("path");

const connectDB = require("./config/db");

// =========================
// ROUTE IMPORTS
// =========================
const dashboardRoutes = require("./routes/dashboardRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const teamRoutes = require("./routes/teamRoutes");
const decisionRoutes = require("./routes/decisionRoutes");
const pollRoutes = require("./routes/pollRoutes");
const communityRoutes = require("./routes/communityRoutes");
const commentRoutes = require("./routes/commentRoutes");
const reportRoutes = require("./routes/reportRoutes");
const communityPostRoutes = require("./routes/communityPostRoutes");
const teamChatRoutes = require("./routes/teamChatRoutes");
const communityCommentRoutes = require("./routes/communityCommentRoutes");
const optionComparisonRoutes = require("./routes/optionComparisonRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const profileAnalyticsRoutes = require("./routes/profileAnalytics");
const publicStatsController = require("./controllers/publicStatsController");

// =========================
// EXPRESS APP
// =========================
const app = express();

// =========================
// CORS CONFIGURATION
// =========================
const allowedOrigins = new Set([
  "http://localhost:5173",
  "https://team-001.vercel.app",
]);

function isAllowedPreviewOrigin(origin) {
  try {
    const url = new URL(origin);

    return (
      url.protocol === "https:" &&
      url.hostname.endsWith(".vercel.app") &&
      url.hostname.startsWith("team-001-")
    );
  } catch {
    return false;
  }
}

const corsOptions = {
  origin(origin, callback) {
    if (
      !origin ||
      allowedOrigins.has(origin) ||
      isAllowedPreviewOrigin(origin)
    ) {
      return callback(null, true);
    }

    console.warn("CORS blocked origin:", origin);
    return callback(new Error("Origin not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// =========================
// GENERAL MIDDLEWARE
// =========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =========================
// SESSION
// =========================
app.use(
  session({
    secret: process.env.JWT_SECRET || "development-only-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

// =========================
// PASSPORT
// =========================
app.use(passport.initialize());
app.use(passport.session());

// =========================
// DATABASE CONNECTION
// =========================
let databaseConnection;

app.use(async (req, res, next) => {
  try {
    if (!databaseConnection) {
      databaseConnection = connectDB();
    }

    await databaseConnection;
    next();
  } catch (error) {
    databaseConnection = null;

    console.error("Database connection failed:", error.message);

    res.status(503).json({
      success: false,
      message: "Database temporarily unavailable",
    });
  }
});

// =========================
// API ROUTES
// =========================
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/decision", decisionRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/team-chat", teamChatRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/community-posts", communityPostRoutes);
app.use("/api/community-comments", communityCommentRoutes);
app.use("/api/option-comparison", optionComparisonRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/profile-analytics", profileAnalyticsRoutes);

// =========================
// PUBLIC STATISTICS
// =========================
app.get("/api/public/stats", publicStatsController.getPublicStats);

// =========================
// HEALTH CHECK
// =========================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DecisionHub API is running",
  });
});

// =========================
// ERROR HANDLER
// =========================
app.use((err, req, res, next) => {
  console.error("API error:", err.message);

  if (res.headersSent) {
    return next(err);
  }

  if (err.message === "Origin not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "Origin not allowed",
    });
  }

  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

// =========================
// SERVER START / VERCEL EXPORT
// =========================

module.exports = app;

// Start the server locally.
// On Vercel, export the app for serverless handling.
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`DecisionHub API running at http://localhost:${PORT}`);
  });
}