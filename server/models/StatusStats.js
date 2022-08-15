const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  F0: {
    type: Number,
    required: true,
    default: 0,
  },
  F1: {
    type: Number,
    required: true,
    default: 0,
  },
  F2: {
    type: Number,
    required: true,
    default: 0,
  },
  F3: {
    type: Number,
    required: true,
    default: 0,
  }
});

module.exports = mongoose.model("StatusStats", statusSchema);