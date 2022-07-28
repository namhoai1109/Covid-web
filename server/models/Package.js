const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^[a-zA-Z ]{1,50}$/.test(v),
      message: (props) => ({ message: `${props.value} is not a valid name` }),
    },
  },
  time_limit: {
    value: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      enum: ["day", "week", "month"],
      required: true,
    },
  },
  limit_per_patient: {
    type: Number,
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        required: true,
      }
    }
  ]
});

module.exports = mongoose.model('Package', packageSchema);