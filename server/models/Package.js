const mongoose = require('mongoose');

const arrayLimit = (val) => {
  return val.length >= 2;
}

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^[a-zA-Z ]{1,50}$/.test(v),
      message: (props) => ({ message: `${props.value} is not a valid name` }),
    },
  },
  max: {
    type: Number,
    required: true,
    validate: {
      validator: (v) => v > 0,
      message: (props) => ({ message: `${props.value} is not a valid number` }),
    }
  },
  products: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    }],
    required: true,
    validate: {
      validator: arrayLimit,
      message: (props) => ({ message: `${props.value} is not a valid array` }),
    }
  }
});

module.exports = mongoose.model('Package', packageSchema);