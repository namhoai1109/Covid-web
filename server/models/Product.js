const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    validate: {
      validator: (v) => v > 0,
      message: (props) => `${props.value} is not a valid capacity`,
    },
  },
  quantity_unit: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
  images: [{
    type: String,
  }]
});

module.exports = mongoose.model("Product", productSchema);
