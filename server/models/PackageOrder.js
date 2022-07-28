const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true,
  },
  time_buy: {
    type: Date,
    immutable: true,
    default: Date.now,
  },
  products_info: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    }
  ]
});

module.exports = mongoose.model('PackageOrder', orderSchema);