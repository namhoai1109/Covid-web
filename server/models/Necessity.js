const mongoose = require("mongoose");

const necessitySchema = new mongoose.Schema({
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
  images: {
    type: [String],
    required: true,
  },
});

module.exports = mongoose.model("Necessity", necessitySchema);
