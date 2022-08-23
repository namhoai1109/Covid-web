const Account = require("../models/Account");
const Log = require("../models/Log");
const bcrypt = require("bcrypt");
const axios = require("axios");
const Bill = require("../models/Bill");
const Income = require("../models/Income");

exports.getPayLog = async (req, res) => {
  try {
    if (req.headers?.authorization?.startsWith("Bearer ")) {
      const token = req.headers.authorization;
      const covidSysURL =
        "https://localhost:5000/api/auth/is-valid-account";
      console.log("Received token " + token);
      axios({
        method: "POST",
        url: covidSysURL,
        headers: {
          Authorization: token,
        },
        data: {
          role: "patient"
        }
      })
        .then(async (response) => {
          try {
            const account = await Account.findOne({
              username: response.data.username,
            });
            if (!account) {
              return res
                .status(404)
                .send({ message: "Account not found" });
            }
            const accountID = account._id;
            const logs = await Log.find({
              account: accountID,
              type: "payment",
            });
            return res.status(200).send(logs);
          } catch (err) {
            res.status(500).send({ message: err.message });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: "Something went wrong, cannot get logs",
          });
        });
    } else {
      res.status(401).send({ message: "Unauthorized" });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

exports.registerAccount = async (req, res) => {
  try {
    if (req.headers?.authorization?.startsWith("Bearer ")) {
      const token = req.headers.authorization;
      const covidSysURL =
        "https://localhost:5000/api/auth/is-valid-account";

      console.log("Received token " + token);
      axios({
        method: "POST",
        url: covidSysURL,
        headers: {
          Authorization: token,
        },
        data: {
          role: "patient"
        }
      })
        .then(async (response) => {
          const covidAccount = await Account.findOne({
            username: response.data.username,
          });
          if (covidAccount) {
            return res
              .status(500)
              .send({ message: "Token account already linked" });
          }

          const hashedPassword = await bcrypt.hash(
            req.body.password,
            10,
          );
          const account = new Account({
            username: response.data.username,
            password: hashedPassword,
            balance: 0,
          });
          await account.save();
          console.log("Valid account");
          res.status(200).send({
            message: "Account linked successfully",
          });
        })
        .catch((err) => {
          res.status(500).send({ message: "Unauthorized" });
        });
    } else {
      res.status(401).send({ message: "Unauthorized" });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

exports.getAccountInfo = async (req, res) => {
  try {
    if (req.headers?.authorization?.startsWith("Bearer ")) {
      const token = req.headers.authorization;
      const covidSysURL =
        "https://localhost:5000/api/auth/is-valid-account";
      console.log("Received token " + token);
      axios({
        method: "POST",
        url: covidSysURL,
        headers: {
          Authorization: token,
        },
        data: {
          role: "patient"
        }
      })
        .then(async (response) => {
          try {
            const account = await Account.findOne(
              { username: response.data.username },
              { password: 0 },
            );

            res.send(account);
          } catch (err) {
            res.status(500).send({ message: err.message });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: "Something went wrong, cannot get logs",
          });
        });
    } else {
      res.status(401).send({ message: "Unauthorized" });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

// Return balance for all accounts in body as parameter
exports.getAccountsInfo = async (req, res) => {
  try {
    if (req.headers?.authorization?.startsWith("Bearer ")) {
      const token = req.headers.authorization;
      const patients = req.body.patients;
      const covidSysURL = "https://localhost:5000/api/auth/is-valid-account";
      axios({
        method: "POST",
        url: covidSysURL,
        headers: {
          Authorization: token,
        },
        data: {
          role: "doctor"
        }
      })
        .then(async (response) => {
          try {
            const accounts = await Account.find({
              username: { $in: patients },
            });
            res.send(accounts);
          } catch (err) {
            res.status(500).send({ message: err.message });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: "Something went wrong, cannot get logs",
          });
        });
    } else {
      res.status(401).send({ message: "Unauthorized" });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
}

exports.getIncomeLog = async (req, res) => {
  try {
    if (req.headers?.authorization?.startsWith("Bearer ")) {
      const token = req.headers.authorization;
      const date = req.body.date;
      const covidSysURL = "https://localhost:5000/api/auth/is-valid-account";
      axios({
        method: "POST",
        url: covidSysURL,
        headers: {
          Authorization: token,
        },
        data: {
          role: "doctor"
        }
      })
        .then(async (response) => {
          try {
            const incomeLog = await Income.find({
              date: date,
            });
            res.send(incomeLog);
          } catch (err) {
            res.status(500).send({ message: err.message });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: "Something went wrong, cannot get logs",
          });
        });
    } else {
      res.status(401).send({ message: "Unauthorized" });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
}