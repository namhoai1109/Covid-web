const Account = require('../models/Account');
const Doctor = require('../models/Doctor');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

// Register doctors
exports.registerAccount = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
	const account = new Account({
		username: req.body.username,
		password: hashedPassword,
		role: 'doctor',
		status: 'active',
	})

  const doctor = new Doctor({
    account_id: account._id
  });

	try {
		await account.save();
    await doctor.save();
		res.status(200).send({ message: 'Account created successfully' });
	} catch (err) {
		res.status(400).send(err.message);
	}
};

// Get list of all doctors
exports.getAll = async (req, res) => {
  try {
    const doctor = await Doctor.find().populate('account_id');
    res.send(doctor);
  } catch (err) {
    res.status(400).send(err);
  }
}

exports.getAdminInfo = async (req, res) => {
  try {
    const admin = await Admin.find().populate('account_id');
    res.send(admin);
  } catch (err) {
    res.status(400).send(err);
  }
}
