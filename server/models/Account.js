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
  password: {
    type: String,
    min: 6,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "doctor", "patient"],
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive"],
    default: "active",
  },
});

module.exports = mongoose.model("Account", accountSchema);
