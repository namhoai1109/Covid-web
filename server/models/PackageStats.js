const mongoose = require("mongoose");

const packageStatsSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
    required: true,
  },
  count: {
    type: Number,
    default: 0,
    required: true,
  }
});

module.exports = mongoose.model("PackageStats", packageStatsSchema);