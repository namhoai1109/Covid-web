const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Facility = require("../models/Facility");
const Log = require("../models/Log");

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