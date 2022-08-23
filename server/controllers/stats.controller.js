const StatusStats = require("../models/StatusStats");
const PackageStats = require("../models/PackageStats");
const ProductStats = require("../models/ProductStats");
const RecoverStats = require("../models/RecoverStats");
const Doctor = require("../models/Doctor");

exports.getStatusStats = async (req, res) => {
    try {
        const statusStats = await StatusStats.find();
        res.send(statusStats);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.getPackageStats = async (req, res) => {
    try {
        const packageStats = await PackageStats.find({
            date: new Date(Date.now()).toISOString().slice(0, 10),
        }).populate("package", { name: 1 });
        res.send(packageStats);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.getProductStats = async (req, res) => {
    try {
        const productStats = await ProductStats.find({
            date: new Date(Date.now()).toISOString().slice(0, 10),
        }).populate("product", { name: 1 });
        res.send(productStats);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.getRecoverDayStats = async (req, res) => {
    try {
        const recoverDayStats = await RecoverStats.find();
        res.send(recoverDayStats);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.getRecoverAllStats = async (req, res) => {
    try {
        const recoverAllStats = await RecoverStats.find().sort({ date: 1 });
        let count = 0;
        recoverAllStats.forEach((stats) => {
            count += stats.count;
        });

        const obj = {
            from: recoverAllStats[0].date,
            to: recoverAllStats[recoverAllStats.length - 1].date,
            count: count,
        };
        res.send(obj);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
