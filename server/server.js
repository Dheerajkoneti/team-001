
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport");

const http = require("http");
const { Server } = require("socket.io");
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
// APP AND SERVER
// =========================
const app = express();
const server = http.createServer(app);

// =========================
// CORS CONFIGURATION
// =========================
const allowedOrigins = [
  "http://localhost:5173",
  "https://team-001.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without an Origin header, such as server-to-server requests.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error("CORS blocked origin:", origin);
    return callback(new Error("Origin not allowed by CORS"));
  },
  credentials: true,
  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],
};

// =========================
// SOCKET.IO CONFIGURATION
// =========================
const io = new Server(server, {
  cors: corsOptions,
});

global.io = io;

io.on("connection", (socket) => {
  console.log("✅ User Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User Disconnected:", socket.id);
  });
});

// =========================
// DATABASE CONNECTION
// =========================
connectDB();

// =========================
// MIDDLEWARE
// =========================
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// =========================
// SESSION
// =========================
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// =========================
// PASSPORT
// =========================
app.use(passport.initialize());
app.use(passport.session());

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

// Retained from your original code
console.log("Team Routes Loaded");

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
app.get(
  "/api/public/stats",
  publicStatsController.getPublicStats
);

// =========================
// TEST ROUTE
// =========================
app.get("/", (req, res) => {
  res.send("🚀 DecisionHub API Running...");
});

// =========================
// ERROR HANDLER
// =========================
app.use((err, req, res, next) => {
  console.error(err.stack || err.message);

  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server Running on Port ${PORT}`);
});
