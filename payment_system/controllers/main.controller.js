const Account = require('../models/Account');
const Log = require('../models/Log');
const bcrypt = require('bcrypt');
const axios = require('axios');
const Bill = require('../models/Bill');

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
exports.makePayment = async(req, res) => {
    try {
       
        const account = await Account.findOne({ username: req.body.buyer_username });
        if (!account) {
            return res.status(404).send({ message: "Account not found" });
        }
        const total = req.body.total_price;
        if (account.balance >= total) {
            account.balance -= total;
            await account.save();
        } else {
            if ((account.balance / total) >= account.credit_limit) {
                account.balance -= total;
                await account.save();
            } else {
                return res.status(502).send({ message: "Credit limit exceeded" });
            }
        }
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
  try {
    if (req.headers?.authorization?.startsWith("Bearer ")) {
      const token = req.headers.authorization;
      const covidSysURL = 'https://localhost:5000/api/auth/is-valid-account'
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const username = req.body.username;

      console.log("Received token " + token);
      axios({
        method: 'POST',
        url: covidSysURL,
        headers: {
          'Authorization': token
        }
      })
        .then(async (response) => {
          const hashedPassword = await bcrypt.hash(req.body.password, 10);
          const account = new Account({
            username: username,
            password: hashedPassword,
            balance: 0
          });
          await account.save();
          console.log("Valid account");
          res.status(200).send({ message: "Account linked successfully" });
        })
        .catch(err => {
          res.status(500).send({ message: "Unauthorized" });
        })
    } else {
      res.status(401).send({ message: "Unauthorized" });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
}
