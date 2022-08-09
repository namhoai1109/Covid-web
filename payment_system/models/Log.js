const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    enum: ["deposit", "payment"],
  },
  description: {
    type: String,
  },
  amount: {
    type: Number,
  },

})

module.exports = mongoose.model("Log", logSchema);
