const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
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
    required: true,
    validate: {
      validator: (v) => /^[a-zA-Z ]{1,50}$/.test(v),
      message: (props) => ({ message: `${props.value} is not a valid name` }),
    },
  },
  // Format: YYYY-MM-DD
  dob: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
    min: 1,
    maxlength: 100,
  },
  status: {
    type: String,
    enum: ["F0", "F1", "F2", "F3"],
    required: true,
  },
  current_facility: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Facility",
  },
  close_contact_list: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Patient",
  },
  credit_limit: {
    type: Number,
  },
  debt_notification: [{
    time: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
    }
  }]
});

module.exports = mongoose.model("Patient", patientSchema);
