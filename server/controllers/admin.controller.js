const Account = require("../models/Account");
const Doctor = require("../models/Doctor");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

// Register doctors
exports.registerAccount = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const account = new Account({
    username: req.body.username,
    password: hashedPassword,
    role: "doctor",
  });

  const doctor = new Doctor({
    account: account._id,
    id_number: req.body.username,
    name: req.body.name,
  });

  try {
    await account.save();
    await doctor.save();
    res.status(200).send({ message: "Account created successfully" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

// Get list of all doctors
exports.getAll = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate(
      "account",
      "_id username role status"
    );
    res.send(doctors);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getAdminInfo = async (req, res) => {
  try {
    const admin = await Admin.find().populate("account_id");
    res.send(admin);
  } catch (err) {
    res.status(400).send(err);
  }
};
