
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const UserActivity = require("../models/UserActivity");
const Achievement = require("../models/Achievement");

// ======================
// Get Profile
// ======================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Existing dashboard statistics
    const stats = {
      decisionsCreated: 12,
      completedDecisions: 8,
      pollsCreated: 5,
      votesCast: 42,
      communitiesJoined: 3,
      successRate: 67,
    };

    const recentActivities = await UserActivity.find({
      userId: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    const achievements = await Achievement.find({
      userId: req.user._id,
    });

    const communityData = [
      { name: "Technology", members: 120 },
      { name: "AI", members: 85 },
      { name: "Startup", members: 65 },
      { name: "Design", members: 42 },
    ];

    const heatmap = [
      { day: "Mon", count: 4 },
      { day: "Tue", count: 2 },
      { day: "Wed", count: 5 },
      { day: "Thu", count: 3 },
      { day: "Fri", count: 6 },
      { day: "Sat", count: 2 },
      { day: "Sun", count: 4 },
    ];

    return res.status(200).json({
      success: true,
      user,
      stats,
      recentActivities,
      achievements,
      communityData,
      heatmap,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch profile",
    });
  }
};

// ======================
// Update Profile
// ======================
exports.updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty",
        });
      }

      user.name = name.trim();
    }

    // avatar must be a persistent URL, not a temporary blob URL
    if (avatar !== undefined) {
      if (typeof avatar !== "string" || avatar.startsWith("blob:")) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid, persistent avatar URL",
        });
      }

      user.avatar = avatar;
    }

    await user.save();

    const safeUser = await User.findById(user._id).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: safeUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update profile",
    });
  }
};

// ======================
// Change Password
// ======================
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current and new passwords are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must contain at least 8 characters",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "Password change is unavailable for this account",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to change password",
    });
  }
};

// ======================
// Delete Account
// ======================
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete account",
    });
  }
};

// ======================
// Admin - Get All Users
// ======================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch users",
    });
  }
};

// ======================
// Admin - Change User Role
// ======================
exports.updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const validRoles = ["user", "moderator", "admin"];

    if (!userId || !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "A valid user ID and role are required",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { role } },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Role updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update role error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update user role",
    });
  }
};
