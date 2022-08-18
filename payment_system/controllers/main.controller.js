const Account = require('../models/Account');
const Log = require('../models/Log');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  try {
    const account = await Account.findOne({ username: req.body.username });
    if (!account) {
      return res.status(404).send({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, account.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid username or password" });
    }

    res.status(200).send({ message: "Logged in successfully" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
}

exports.getAccountInfo = async (req, res) => {
  try {
    const account = await Account.findOne({ username: req.params.id });
    res.send(account);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

// 

// Make a deposit (nap tien)
exports.makeDeposit = async (req, res) => {
  try {
    const account = await Account.findOne({ username: req.params.id });
    if (!account) {
      return res.status(404).send({ message: "Account not found" });
    }
    account.balance += req.body.amount;
    await account.save();

    // Save log
    const log = new Log({
      account: account._id,
      type: "deposit",
      description: `Account ${account.username} made a deposit`,
      amount: req.body.amount,
    })
    await log.save();

    res.status(200).send({ message: "Deposit made successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

// Make a payment
exports.makePayment = async (req, res) => {
  try {
    const account = await Account.findOne({ username: req.params.id });
    account.balance -= req.body.amount;
    await account.save();

    // Transfer money to admin account
    const adminAccount = await Account.findOne({ username: "000000000" })
    adminAccount.balance += req.body.amount;
    await adminAccount.save();

    res.status(200).send({ message: "Payment made successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.changePassword = async (req, res) => {
  try {
    const account = await Account.find({ username: req.params.id });
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    account.password = hashedPassword;
    await account.save();
    res.status(200).send({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.registerAccount = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const account = new Account({
    username: req.body.username,
    password: hashedPassword,
    balance: 0
  });

  try {
    await account.save();
    res.status(200).send({ message: "Account created successfully" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
}
