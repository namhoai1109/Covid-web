const Account = require("../models/Account");
const Log = require("../models/Log");
const bcrypt = require("bcrypt");
const axios = require("axios");
const Bill = require("../models/Bill");

exports.getAccountInfo = async (req, res) => {
    try {
        const account = await Account.findOne(
            { username: req.idNumber },
            { password: 0 },
        );
        res.send(account);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

// Make a deposit (nap tien)
exports.makeDeposit = async (req, res) => {
    try {
        const account = await Account.findOne({ username: req.idNumber });
        if (!account) {
            return res.status(404).send({ message: "Account not found" });
        }

        if (req.body.amount <= 0) {
            return res.status(400).send({ message: "Invalid amount" });
        }

        account.balance += req.body.amount;
        await account.save();

        // Save log
        const log = new Log({
            account: account._id,
            type: "deposit",
            description: `Account ${account.username} made a deposit`,
            amount: req.body.amount,
        });
        await log.save();

        res.status(200).send({ message: "Deposit made successfully" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

// Make a payment
exports.makePayment = async (req, res) => {
    try {
        const account = await Account.findOne({
            username: req.body.bill.buyer_username,
        });
        if (!account) {
            return res.status(404).send({ message: "Account not found" });
        }

        const total = req.body.bill.total_price;
        if (account.balance >= total) {
            account.balance -= total;
            await account.save();
        } else {
            if (account.balance / total >= account.credit_limit) {
                account.balance -= total;
                await account.save();
            } else {
                return res.status(502).send({ message: "Insufficient credit" });
            }
        }

        // Save payment bill
        const bill = new Bill(req.body.bill);
        bill.paid = true;
        await bill.save();

        // Save payment log
        const log = new Log({
            account: account._id,
            type: "payment",
            description: `Account ${account.username} made a payment`,
            amount: bill.total_price,
        });
        await log.save();

        res.status(200).send({ message: "Payment made successfully" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.getPayLog = async (req, res) => {
    try {
        const account = await Account.findOne({ username: req.idNumber });
        if (!account) {
            return res.status(404).send({ message: "Account not found" });
        }
        const accountID = account._id;
        const logs = await Log.find({ account: accountID });
        return res.status(200).send(logs);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        if (!req.body.old_password || !req.body.new_password) {
            return res.status(400).send({ message: "Missing parameters" });
        }

        const account = await Account.findOne({ username: req.idNumber });
        if (!account) {
            return res.status(404).send({ message: "Account not found" });
        }

        // Compare old password
        const isMatch = await bcrypt.compare(
            req.body.old_password,
            account.password,
        );
        if (!isMatch) {
            return res.status(401).send({ message: "Invalid old password" });
        }

        const hashedPassword = await bcrypt.hash(req.body.new_password, 10);
        account.password = hashedPassword;
        await account.save();

        res.status(200).send({ message: "Password changed successfully" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.registerAccount = async (req, res) => {
    try {
        if (req.headers?.authorization?.startsWith("Bearer ")) {
            const token = req.headers.authorization;

            const covidSysURL =
                "https://localhost:5000/api/auth/is-valid-account";
            const username = req.body.username;

            console.log("Received token " + token);
            axios({
                method: "POST",
                url: covidSysURL,
                headers: {
                    Authorization: token,
                },
            })
                .then(async (response) => {
                    const hashedPassword = await bcrypt.hash(
                        req.body.password,
                        10,
                    );
                    const account = new Account({
                        username: username,
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
