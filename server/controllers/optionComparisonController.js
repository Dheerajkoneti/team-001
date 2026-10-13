
const mongoose = require("mongoose");
const Decision = require("../models/Decision");
const Team = require("../models/Team");
const OptionComparison = require("../models/OptionComparison");

const isValidId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

const canAccessDecision = async (decisionId, userId) => {
  if (!isValidId(decisionId)) return null;

  const decision = await Decision.findById(decisionId);
  if (!decision) return null;

  const team = await Team.findOne({
    _id: decision.team,
    $or: [
      { leader: userId },
      { members: userId }
    ]
  });

  return team ? decision : null;
};

const validateComparison = (title, options) => {
  if (!title || !title.trim()) {
    return "Comparison title is required";
  }

  if (!Array.isArray(options) || options.length < 2) {
    return "At least two options are required";
  }

  if (options.some(
    (option) => !option.name || !option.name.trim()
  )) {
    return "Every option must have a name";
  }

  return null;
};

// CREATE COMPARISON
exports.createComparison = async (req, res) => {
  try {
    const { decisionId, title, options } = req.body;

    const validationError = validateComparison(title, options);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    if (!decisionId || !isValidId(decisionId)) {
      return res.status(400).json({
        success: false,
        message: "A valid decision ID is required"
      });
    }

    const decision = await canAccessDecision(
      decisionId,
      req.user._id
    );

    if (!decision) {
      return res.status(404).json({
        success: false,
        message: "Decision not found or access denied"
      });
    }

    const comparison = await OptionComparison.create({
      decisionId: decision._id.toString(),
      title: title.trim(),
      options
    });

    return res.status(201).json({
      success: true,
      message: "Comparison created successfully",
      comparison
    });
  } catch (error) {
    console.error("Create comparison error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create comparison"
    });
  }
};

// GET COMPARISON BY DECISION ID
exports.getComparison = async (req, res) => {
  try {
    const { decisionId } = req.params;

    const decision = await canAccessDecision(
      decisionId,
      req.user._id
    );

    if (!decision) {
      return res.status(404).json({
        success: false,
        message: "Decision not found or access denied"
      });
    }

    const comparison = await OptionComparison.findOne({
      decisionId: decision._id.toString()
    }).sort({ createdAt: -1 });

    if (!comparison) {
      return res.status(404).json({
        success: false,
        message: "Comparison not found"
      });
    }

    return res.status(200).json({
      success: true,
      comparison
    });
  } catch (error) {
    console.error("Get comparison error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve comparison"
    });
  }
};

// GET ALL COMPARISONS ACCESSIBLE TO THE USER
exports.getAllComparisons = async (req, res) => {
  try {
    const teams = await Team.find({
      $or: [
        { leader: req.user._id },
        { members: req.user._id }
      ]
    }).select("_id");

    const teamIds = teams.map((team) => team._id);

    const decisions = await Decision.find({
      team: { $in: teamIds }
    }).select("_id");

    const decisionIds = decisions.map(
      (decision) => decision._id.toString()
    );

    const comparisons = await OptionComparison.find({
      decisionId: { $in: decisionIds }
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: comparisons.length,
      comparisons
    });
  } catch (error) {
    console.error("List comparisons error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve comparisons"
    });
  }
};

// UPDATE COMPARISON
exports.updateComparison = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, options } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comparison ID"
      });
    }

    const comparison = await OptionComparison.findById(id);

    if (!comparison) {
      return res.status(404).json({
        success: false,
        message: "Comparison not found"
      });
    }

    const decision = await canAccessDecision(
      comparison.decisionId,
      req.user._id
    );

    if (!decision) {
      return res.status(403).json({
        success: false,
        message: "You cannot access this comparison"
      });
    }

    const nextTitle = title === undefined
      ? comparison.title
      : title;

    const nextOptions = options === undefined
      ? comparison.options
      : options;

    const validationError = validateComparison(
      nextTitle,
      nextOptions
    );

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    comparison.title = nextTitle.trim();
    comparison.options = nextOptions;

    await comparison.save();

    return res.status(200).json({
      success: true,
      message: "Comparison updated successfully",
      comparison
    });
  } catch (error) {
    console.error("Update comparison error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update comparison"
    });
  }
};

// DELETE COMPARISON
exports.deleteComparison = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comparison ID"
      });
    }

    const comparison = await OptionComparison.findById(id);

    if (!comparison) {
      return res.status(404).json({
        success: false,
        message: "Comparison not found"
      });
    }

    const decision = await canAccessDecision(
      comparison.decisionId,
      req.user._id
    );

    if (!decision) {
      return res.status(403).json({
        success: false,
        message: "You cannot access this comparison"
      });
    }

    await comparison.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Comparison deleted successfully"
    });
  } catch (error) {
    console.error("Delete comparison error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete comparison"
    });
  }
};
