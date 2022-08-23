const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  buyer_username: {
    type: String,
    required: true,
  },
  buyer_account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
  },
  time_buy: {
    type: Date,
    immutable: true,
    default: Date.now,
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
  },
  products_info: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  }],
  credit_limit: {
    type: Number,
    required: true,
  },
  total_price: {
    type: Number,
  },
  paid: {
    type: Boolean,
  }
});

module.exports = mongoose.model("Bill", billSchema);
