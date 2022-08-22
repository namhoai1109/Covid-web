const mongoose = require("mongoose");

const recoverStatsSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
    default: 0
  }
});

module.exports = mongoose.model("RecoverStats", recoverStatsSchema);
