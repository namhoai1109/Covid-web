const Account = require("../models/Account");
const Admin = require("../models/Admin");
const Log = require("../models/Log");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const axios = require("axios");

exports.login = async (req, res) => {
  try {
    const account = await Account.findOne({ username: req.body.username });
    if (!account) {
      return res
        .status(401)
        .send({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(
      req.body.password,
      account.password,
    );
    if (!isMatch) {
      return res
        .status(401)
        .send({ message: "Invalid username or password" });
    }

    if (account.status === "inactive") {
      return res.status(401).send({
        message:
          "Account is disabled, please contact your administrator",
      });
    }

    // If account is legit, save log info
    const log = new Log({
      account: account._id,
      action: `login`,
      description: `Account ${account.username} logged in`,
    });
    await log.save();

    // Assign token
    const token = jwt.sign(
      { _id: account.username },
      process.env.TOKEN_SECRET,
    );
    res.send({
      token: token,
      username: account.username,
      role: account.role,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

// Check if patient account has logged in, if has never logged in, return to client side for setting new password
exports.checkHasLoggedIn = async (req, res) => {
  try {
    const account = await Account.findOne({ username: req.body.username });
    if (!account) {
      return res.status(404).send({ message: "Invalid username" });
    }

    if (account.role === "patient") {
      const log = await Log.findOne({
        account: account._id,
        action: `login`,
      });

      if (!log) {
        return res.status(200).send({ message: false });
      }
    }

    res.status(200).send({ message: true });
  } catch (err) {
    res.status(500).send({ message: err });
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

// Check if account is valid with jwt (used with PaySys)
exports.checkValidAccount = async (req, res) => {
  try {
    const token = req.headers.authorization.split("Bearer ")[1];
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    const idNumber = verified._id;
    const account = await Account.findOne({ username: idNumber });
    const role = req.body.role;

    if (!account) {
      return res.status(404).send({ message: "Invalid username" });
    }

    if (account.role !== role) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    if (account.status === "inactive") {
      return res.status(401).send({
        message:
          "Account is disabled, please contact your administrator",
      });
    }

    res.status(200).send({
      message: "Valid account",
      username: account.username,
    });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

exports.initCheck = async (req, res) => {
  try {
    const account = await Account.find();
    if (account.length === 0) {
      return res.status(200).send({ message: "False" });
    } else {
      return res.status(200).send({ message: "True" });
    }
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

exports.initAdmin = async (req, res) => {
  try {
    const account = await Account.find();
    if (account.length !== 0) {
      return res.status(500).send({ message: "Admin already exists" });
    }

    // Create admin account
    if (req.body.password.length < 6) {
      return res.status(400).send({ message: "Password must be at least 6 characters" });
    }

    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    const adminAccount = new Account({
      username: req.body.username,
      password: hashedPassword,
      role: "admin",
    });
    await adminAccount.save();

    // Create admin
    const admin = new Admin({
      account: adminAccount._id,
    });
    await admin.save();

    // Link admin to PaySys
    const paySysURL = `https://localhost:${process.env.PAYMENT_SYSTEM_PORT}/api/auth/init`
    axios({
      method: "POST",
      url: paySysURL,
      data: {
        username: req.body.username,
        password: req.body.password
      }
    })
      .then(response => {
        adminAccount.linked = true;
        adminAccount.save();
        res.status(200).send({ message: "Admin created successfully" });
      })
      .catch(err => {
        res.status(500).send({ message: err });
      })

  } catch (err) {
    res.status(500).send({ message: err });
  }
};
