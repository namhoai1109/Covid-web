const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  id_number: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => /^(\d{9}|\d{11})$/.test(v), //only digits
      message: (props) => ({
        message: `${props.value} is not a valid id number`,
      }),
    },
  },
  name: {
    type: String,
    default: "Anonymous",
    validate: {
      validator: (v) => /^[a-zA-Z ]+$/.test(v),
      message: (props) => ({ message: `${props.value} is not a valid name` }),
    },
    min: 1,
    max: 50,
  },
  patients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
  ],
});

module.exports = mongoose.model("Doctor", doctorSchema);
