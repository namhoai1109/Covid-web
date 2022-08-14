const mongoose = require("mongoose");

const packageStatsSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  package: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model("PackageStats", packageStatsSchema);