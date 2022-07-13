const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  account_id: {
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
      message: (props) => `${props.value} is not a valid id number`,
    },
  },
  name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  // Format: YYYY-MM-DD
  DOB: {
    type: Date,
    required: true,
    validate: {
      validator: (v) => v.getFullYear() > 1900,
      message: (props) => `${props.value} is not a valid date`,
    }
  },
  address: {
    type: String,
    required: true,
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
  // Haven't figured this out, maybe later
  // history:
  // {

  // }
  close_contact_list: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Patient",
  },
});

module.exports = mongoose.model("Patient", patientSchema);
