require("dotenv").config();
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Facility = require("../models/Facility");
const Log = require("../models/Log");
const Account = require("../models/Account");
const Package = require("../models/Package");
const PackageOrder = require("../models/PackageOrder");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const Bill = require("../models/Bill");

exports.getLogs = async (req, res) => {
    try {
        const patient = await Patient.findOne({ id_number: req.idNumber });
        if (!patient) {
            return res
                .status(500)
                .send({ message: "Patient not found in the database" });
        }
        const logs = await Log.find({ account: patient.account });
        res.status(200).send(logs);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.getInfo = async (req, res) => {
    try {
        const patient = await Patient.findOne(
            { id_number: req.idNumber },
            { close_contact_list: 0 },
        )
            .populate("current_facility")
            .populate("account");
        if (!patient) {
            return res
                .status(500)
                .send({ message: "Patient not found in the database" });
        }
        res.status(200).send(patient);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const patient = await Patient.findOne({
            id_number: req.idNumber,
        }).populate("account");
        if (!patient) {
            return res
                .status(500)
                .send({ message: "Patient not found in the database" });
        }
        const newPassword = await bcrypt.hash(req.body.new_password, 10);
        patient.account.password = newPassword;
        await patient.account.save();
        res.status(200).send({ message: "Password changed successfully" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.buyPackage = async (req, res) => {
    try {
        const patient = await Patient.findOne({ id_number: req.idNumber });
        if (!patient) {
            return res
                .status(500)
                .send({ message: "Patient not found in the database" });
        }
        const package = await Package.findById(req.params.id).populate(
            "products.product",
        );
        if (!package) {
            return res
                .status(500)
                .send({ message: "Package not found in the database" });
        }

        // Check time limit
        const firstOrder = await PackageOrder.findOne({
            buyer: patient._id,
            package: package._id,
        }).sort({ time_buy: 1 });
        if (firstOrder) {
            const timeFirstBuy = firstOrder.time_buy;
            const timeDiff = (Date.now() - timeFirstBuy) / 1000 / 60 / 60 / 24; //in days
            const timeLimit = package.time_limit;
            const conversion = {
                day: 1,
                week: 7,
                month: 30,
            };
            const timeLimitInDays =
                timeLimit.value * conversion[timeLimit.unit];
            if (timeDiff > timeLimitInDays) {
                return res.status(500).send({ message: "Time limit exceeded" });
            }
        }

        // Check quantity limit per patient
        const packageLimit = package.limit_per_patient;
        const orders = await PackageOrder.find({
            buyer: patient._id,
            package: package._id,
        });
        if (orders.length >= packageLimit) {
            return res
                .status(500)
                .send({ message: "Limit per patient exceeded" });
        }

        // Save order information
        let total_price = 0;
        const productsInPackage = package.products;
        const productsToBuy = req.body.products;
        const productsToBuyInfo = [];
        productsInPackage.forEach((product) => {
            const productToBuy = productsToBuy.find(
                (p) => p.id.toString() === product.product._id.toString(),
            );
            if (!productToBuy) {
                throw Error("Product not found in the package");
            }
            if (productToBuy.quantity > product.quantity) {
                throw Error(
                    "Not enough quantity of product " + product.product.name,
                );
            }

            productsToBuyInfo.push({
                product: product.product._id,
                quantity: productToBuy.quantity,
            });

            total_price += productToBuy.quantity * product.product.price;
        });

        // TODO: Call api to payment system to buy products
        // TODO: Save this for later to save package history
        // Create a new package order
        // const packageOrder = new PackageOrder({
        //     buyer: patient._id,
        //     package: package._id,
        //     time_buy: Date.now(),
        //     products_info: productsToBuyInfo,
        // });
        // await packageOrder.save();
        const credit_limit = patient.credit_limit;
        const order_bill = new Bill({
            buyer: patient._id,
            buyer_username: patient.id_number,
            package: package._id,
            time_buy: Date.now(),
            products_info: productsToBuyInfo,
            credit_limit: credit_limit,
            total_price: total_price,
        });
        let bill_id;
        await order_bill
            .save()
            .then((bill) => {
                bill_id = bill._id;
            })
            .catch((err) => {
                res.status(500).send(err);
            });
        res.status(200).send({
            message: "Package validated, bill saved, waiting for payment",
            bill_id: bill_id,
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
exports.deleteBill = async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id);
        if (!bill) {
            return res.status(500).send({ message: "Bill not found" });
        }
        await bill.remove();
        res.status(200).send({ message: "Bill deleted" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
exports.payBill = async (req, res) => {
    const PSURL = `https://localhost:${process.env.PAYMENT_SYSTEM_PORT}/api/main/pay`;
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
        return res.status(500).send({ message: "Bill not found" });
    }
    axios
        .post(PSURL, bill)
        .then(async (response) => {
            //TODO: Save bill as paid and history of package usage
            bill.paid = true;
            await bill.save();

            res.status(200).send({
                message: "Bill paid, order successful, package usage saved",
            });
        })
        .catch((err) => {
            res.status(500).send(err);
        });
};

exports.linkAccount = async (req, res) => {
    try {
        const account = await Account.findOne({ username: req.idNumber });
        if (!account) {
            return res
                .status(500)
                .send({ message: "Account not found in the database" });
        }

        const PSURL = `https://localhost:${process.env.PAYMENT_SYSTEM_PORT}/api/main/register`;
        axios({
            method: "POST",
            url: PSURL,
            headers: {},
            data: {
                username: account.username,
                password: "placeholder",
            },
        })
            .then(async function (response) {
                account.linked = true;
                await account.save();
                res.status(200).send({
                    message: "Account linked successfully",
                });
            })
            .catch(function (error) {
                res.status(500).send({ message: error.message });
            });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
