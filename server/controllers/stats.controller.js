const StatusStats = require("../models/StatusStats");
const PackageStats = require("../models/PackageStats");
const ProductStats = require("../models/ProductStats");
const RecoverStats = require("../models/RecoverStats");
const Doctor = require("../models/Doctor");
const IncomeStats = require("../models/IncomeStats");

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

// // Get Income - Expense log from PaySys
// exports.getIncomeExpenseLog = async (req, res) => {
//   try {
//     const date = req.body.date;
//     // Calling API From PaySys
//     const paySysURL = `https://localhost:${process.env.PAYMENT_SYSTEM_PORT}/api/shared/income-log`;
//     const token = req.headers.authorization;
//     axios({
//       method: "GET",
//       url: paySysURL,
//       data: {
//         date: date
//       },
//       headers: {
//         "Authorization": token
//       }
//     })
//       .then((response) => {
//         const incomeLog = response.data
//         res.status(200).send(incomeLog);
//       })
//       .catch((error) => {
//         res.status(500).send(error.response.data);
//       });
//   } catch (err) {
//     res.status(500).send({ message: err.message });
//   }
// }

// Get Income
exports.getIncomeLog = async (req, res) => {
    try {
        const income = await IncomeStats.find();
        if (!income) {
            res.status(404).send({ message: "Income not found" });
        }
        res.status(200).send(income);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
