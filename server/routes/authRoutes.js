const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const {
  register,
  login,
  verifyEmail,
  resendVerificationCode,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

/* ==========================
   Normal Authentication
========================== */

// Register User
router.post("/register", register);

// Login User
router.post("/login", login);

// Verify Email OTP
router.post("/verify-email", verifyEmail);

// Resend Email OTP
router.post("/resend-otp", resendVerificationCode);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Reset Password
router.post("/reset-password", resetPassword);


/* ==========================
   Google Authentication
========================== */

const CLIENT_URL = (
  process.env.CLIENT_URL || "http://localhost:5173"
).replace(/\/$/, "");

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

/* ==========================
   Google Callback
========================== */

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${CLIENT_URL}/login`,
  }),
  async (req, res) => {
    try {
      const token = jwt.sign(
        {
          id: req.user._id,
          role: req.user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.redirect(
        `${CLIENT_URL}/dashboard?token=${encodeURIComponent(token)}`
      );
    } catch (error) {
      console.error("Google Auth Error:", error);
      res.redirect(`${CLIENT_URL}/login`);
    }
  }
);


module.exports = router;
