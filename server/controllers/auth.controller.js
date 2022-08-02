const Account = require("../models/Account");
const Log = require("../models/Log");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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

        res.status(200).send({ message: "Password changed" });
    } catch (err) {
        res.status(500).send({ message: err });
    }
};
