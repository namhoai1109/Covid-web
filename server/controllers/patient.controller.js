const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Facility = require("../models/Facility");
const Log = require("../models/Log");
const Account = require("../models/Account");
const bcrypt = require("bcryptjs");

exports.getLogs = async (req, res) => {
  try {
    const patient = await Patient.findOne({ id_number: req.idNumber });
    if (!patient) {
      return res.status(500).send({ message: "Patient not found in the database" });
    }
    const logs = await Log.find({ account: patient.account });
    res.status(200).send(logs);

  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.getInfo = async (req, res) => {
  try {
    const patient = await Patient.findOne({ id_number: req.idNumber }, { account: 0, close_contact_list: 0 }).populate("current_facility");
    if (!patient) {
      return res.status(500).send({ message: "Patient not found in the database" });
    }
    res.status(200).send(patient);

  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.changePassword = async (req, res) => {
  try {
    const patient = await Patient.findOne({ id_number: req.idNumber }).populate("account");
    if (!patient) {
      return res.status(500).send({ message: "Patient not found in the database" });
    }
    const newPassword = await bcrypt.hash(req.body.new_password, 10);
    patient.account.password = newPassword;
    await patient.account.save();
    res.status(200).send({ message: "Password changed successfully" });

  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}