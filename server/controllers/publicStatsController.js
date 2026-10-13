const User = require("../models/User");
const Team = require("../models/Team");
const Decision = require("../models/Decision");
const Poll = require("../models/Poll");
const Vote = require("../models/Vote");

exports.getPublicStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalTeams,
      totalDecisions,
      totalPolls,
      totalVotes
    ] = await Promise.all([
      User.countDocuments(),
      Team.countDocuments(),
      Decision.countDocuments(),
      Poll.countDocuments(),
      Vote.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalTeams,
        totalDecisions,
        totalPolls,
        totalVotes
      }
    });
  } catch (error) {
    console.error("Public stats error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load public statistics"
    });
  }
};