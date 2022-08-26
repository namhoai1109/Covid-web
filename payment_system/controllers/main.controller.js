const Account = require("../models/Account");
const Log = require("../models/Log");
const bcrypt = require("bcrypt");
const axios = require("axios");
const Bill = require("../models/Bill");
const Income = require("../models/Income");

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
        const adminAccount = await Account.findOne({ role: "admin" });

        if (req.body.amount <= 0) {
            return res.status(400).send({ message: "Invalid amount" });
        }

        let debt = 0,
            income = adminAccount.balance;
        if (account.balance < 0) {
            debt = account.balance * -1;
        }

        account.balance += req.body.amount;
        if (account.balance < 0) {
            account.in_debt = true;
            adminAccount.balance += req.body.amount;
        } else {
            account.in_debt = false;
            adminAccount.balance += debt;
        }
        account.save();
        adminAccount.save();
        income = adminAccount.balance - income;

        // Income Logging
        await Income.updateOne(
            {
                date: new Date(Date.now()).toISOString().slice(0, 10),
            },
            { $inc: { income: income } },
            { upsert: true },
        );

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
        let incomeResponse = 0;
        let expenseResponse = 0;
        const account = await Account.findOne({
            username: req.body.bill.buyer_username,
        });
        if (!account) {
            return res.status(404).send({ message: "Account not found" });
        }

        // Find the admin account to update balance
        const adminAccount = await Account.findOne({ role: "admin" });
        if (!adminAccount) {
            return res.status(500).send({ message: "Admin account not found" });
        }

        const total = req.body.bill.total_price;
        if (account.balance >= total) {
            // Update balance of admin
            adminAccount.balance += total;
            await adminAccount.save();

            // Decrement balance of buyer
            account.balance -= total;
            await account.save();
            await Income.updateOne(
                {
                    date: new Date(Date.now()).toISOString().slice(0, 10),
                },
                { $inc: { income: total } },
                { upsert: true },
            );
            incomeResponse = total;
            expenseResponse = 0;
        } else {
            if (account.balance >= total * req.body.bill.credit_limit) {
                const incomeFromBalance = account.balance;
                const debt = total - account.balance;

                // Update balance of admin
                adminAccount.balance =
                    adminAccount.balance + incomeFromBalance - debt;
                await adminAccount.save();

                account.balance -= total;
                account.in_debt = true;
                await Income.updateOne(
                    {
                        date: new Date(Date.now()).toISOString().slice(0, 10),
                    },
                    {
                        $inc: {
                            income: incomeFromBalance,
                            expense: debt,
                        },
                    },
                    { upsert: true },
                );
                incomeResponse = incomeFromBalance;
                expenseResponse = debt;
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

        res.status(200).send({
            message: "Payment made successfully",
            data: {
                income: incomeResponse,
                expense: expenseResponse,
            },
        });
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

        if (req.body.new_password.length < 6) {
            return res.status(400).send({
                message: "New password must be at least 6 characters",
            });
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
