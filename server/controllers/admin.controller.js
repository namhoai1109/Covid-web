const Account = require("../models/Account");
const Doctor = require("../models/Doctor");
const Log = require("../models/Log");
const bcrypt = require("bcryptjs");

// Register doctors
exports.registerAccount = async (req, res) => {
  if (req.body.password.length < 6) {
    return res.status(400).send({ message: "Password must be at least 6 characters" });
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const account = new Account({
    username: req.body.username,
    password: hashedPassword,
    role: "doctor",
  });

  const doctor = new Doctor({
    account: account._id,
    id_number: req.body.username,
  });

  if (req.body.name) {
    doctor.name = req.body.name;
  }

  await doctor.save()
    .then(async () => {
      await account.save();
      res.status(200).send({ message: "Account created successfully" });
    })
};

// Get list of all doctors
exports.getAll = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate(
      "account",
      "_id username role status",
    );
    res.send(doctors);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Change status of doctor account
exports.changeStatus = async (req, res) => {
  try {
    const doctor = await Account.findById(req.params.id);
    doctor.status = req.body.status;
    await doctor.save();
    res.status(200).send({ message: "Status changed successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Delete account from database
exports.deleteAccount = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    const doctorAccount = await Account.findByIdAndDelete(doctor.account);
    doctorAccount.remove();
    doctor.remove();
    res.status(200).send({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

// Get doctor logs
exports.getLogs = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    const logs = await Log.find({ account: doctor.account }).sort({
      time: -1,
    });

    res.send(logs);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
