const Account = require("../models/Account");
const Log = require("../models/Log");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.initAdmin = async (req, res) => {
  try {
    const account = await Account.find();
    if (account.length === 0) {
      const password = req.body.password;
      const hashedPassword = await bcrypt.hash(password, 10);
      const adminAccount = new Account({
        username: req.body.username,
        password: hashedPassword,
        role: "admin",
        balance: 0,
      });

      await adminAccount.save();
      return res.status(200).send({ message: "Admin linked successfully" });
    }

    res.status(500).send({ message: "Admin already exists" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
}

exports.checkHasLoggedIn = async (req, res) => {
  try {
    const account = await Account.findOne({ username: req.body.username });
    if (!account) {
      return res.status(404).send({ message: "Invalid username" });
    }

    if (account.role === 'admin') {
      return res.status(200).send({ message: true });
    }

    const log = await Log.findOne({
      account: account._id,
      action: `login`,
    });

    if (!log) {
      return res.status(200).send({ message: false });
    }

    res.status(200).send({ message: true });
  } catch (err) {
    res.status(500).send({ message: err });
  }
}

exports.login = async (req, res) => {
  try {
    const account = await Account.findOne({ username: req.body.username });
    if (!account) {
      return res
        .status(404)
        .send({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      account.password,
    );
    if (!isPasswordValid) {
      return res
        .status(401)
        .send({ message: "Invalid username or password" });
    }

    const log = new Log({
      account: account._id,
      action: `login`,
      description: `Account ${account.username} logged in`,
    });
    await log.save();

    // Assign token
    const token = jwt.sign(
      { _id: account.username },
      process.env.PS_TOKEN_SECRET,
    );

    res.send({
      token: token,
      username: account.username,
    });

  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

// Set new password for new patient account that has never logged in
exports.updatePassword = async (req, res) => {
  try {
    const account = await Account.findOne({ username: req.body.username });
    if (!account) {
      return res.status(404).send({ message: "Invalid username" });
    }
    const newPassword = await bcrypt.hash(req.body.password, 10);
    account.password = newPassword;
    await account.save();

    res.status(200).send({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};