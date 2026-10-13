require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport");

const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

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
const communityPostRoutes =
require("./routes/communityPostRoutes");
const teamChatRoutes =
require("./routes/teamChatRoutes");
const communityCommentRoutes =
require(
"./routes/communityCommentRoutes"
);
const app = express();
const server = http.createServer(app);
const optionComparisonRoutes =
require("./routes/optionComparisonRoutes");
const feedbackRoutes =
require("./routes/feedbackRoutes");
const analyticsRoutes = require(
  "./routes/analyticsRoutes"
);
const publicStatsController =
  require("./controllers/publicStatsController");

// =========================
// SOCKET.IO CONFIGURATION
// =========================
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// Make io available globally
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
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const path = require("path");

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
// ROUTES
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
app.use(
  "/api/team-chat",
  teamChatRoutes
);
console.log("Team Routes Loaded");
app.use("/api/team", teamRoutes);
app.use(
 "/api/community-posts",
 communityPostRoutes
);
app.use(
"/api/community-comments",
communityCommentRoutes
);
app.use(
 "/api/option-comparison",
 optionComparisonRoutes
);
app.use(
"/api/feedback",
feedbackRoutes
);
app.use(
  "/api/analytics",
  analyticsRoutes
);
app.use(
  "/api/profile-analytics",
  require("./routes/profileAnalytics")
);
// Public statistics for the Landing Page
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
  console.error(err.stack);

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