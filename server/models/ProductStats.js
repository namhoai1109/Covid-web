const mongoose = require("mongoose");

const productStatsSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  count: {
    type: Number,
    required: true,
    default: 0
  }
});

module.exports = mongoose.model("ProductStats", productStatsSchema);
