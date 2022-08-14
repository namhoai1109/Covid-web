const Account = require("../models/Account");
const Log = require("../models/Log");
const bcrypt = require("bcrypt");

exports.checkHasLoggedIn = async (req, res) => {
    try {
        const account = await Account.findOne({ username: req.body.username });
        if (!account) {
            return res.status(404).send({ message: "Invalid username" });
        }

        if (req.body.username === "000000000") {
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
};

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

        res.status(200).send({ message: "Logged in successfully" });
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};
