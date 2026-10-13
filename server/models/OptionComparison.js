
const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  cost: {
    type: String,
    default: ""
  },
  scalability: {
    type: String,
    default: ""
  },
  security: {
    type: String,
    default: ""
  },
  performance: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    default: ""
  }
});

const optionComparisonSchema = new mongoose.Schema(
  {
    decisionId: {
      type: String,
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    options: {
      type: [optionSchema],
      required: true,
      validate: {
        validator: (options) => options.length >= 2,
        message: "At least two options are required"
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "OptionComparison",
  optionComparisonSchema
);
