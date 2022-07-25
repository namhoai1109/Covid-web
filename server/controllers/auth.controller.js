const Account = require("../models/Account");
const Log = require("../models/Log");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  try {
    const account = await Account.findOne({ username: req.body.username });
    if (!account) {
      return res.status(401).send({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(req.body.password, account.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Invalid username or password" });
    }

    if (account.status === "inactive") {
      return res.status(401).send({
        message: "Account is disabled, please contact your administrator",
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
    const token = jwt.sign({ _id: account.username }, process.env.TOKEN_SECRET);
    res.send({ token: token, username: account.username, role: account.role });
  } catch (err) {
    res.status(400).send(err);
  }
};
