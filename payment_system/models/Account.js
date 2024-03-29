const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => /^(\d{9}|\d{11})$/.test(v), // only digits
      message: (props) => `${props.value} is not a valid id number`,
    },
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'user'],
    default: 'user'
  },
  password: {
    type: String,
    min: 6,
  },
  balance: {
    type: Number,
    default: 0,
  },
  linked: {
    type: Boolean,
    default: true,
  },
  in_debt: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model("Account", accountSchema);
