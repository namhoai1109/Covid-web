const StatusStats = require("../models/StatusStats");
const PackageStats = require("../models/PackageStats");
const ProductStats = require("../models/ProductStats");
const Doctor = require("../models/Doctor");

exports.getStatusStats = async (req, res) => {
  try {
    const statusStats = await StatusStats.find();
    res.send(statusStats);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.getPackageStats = async (req, res) => {
  try {
    const packageStats = await PackageStats.find({
      date: new Date(Date.now()).toISOString().slice(0, 10)
    }).populate("package", { name: 1 });
    res.send(packageStats);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.getProductStats = async (req, res) => {
  try {
    const productStats = await ProductStats.find({
      date: new Date(Date.now()).toISOString().slice(0, 10)
    }).populate("product", { name: 1 });
    res.send(productStats);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

