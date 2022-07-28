const Package = require('../models/Package');
const Product = require('../models/Product');
const Patient = require('../models/Patient');

const validatePackage = (package) => {
  if (!package.name) {
    return {
      result: false,
      message: "Name is required"
    };
  }
  if (!package.products) {
    return {
      result: false,
      message: "Products are required"
    };
  }
  if (package.products.length < 2) {
    return {
      result: false,
      message: `Number of products must be at least 2`
    };
  };

  return {
    result: true,
    message: ""
  }
}

exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find().populate('products.product');
    res.status(200).send(packages);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.registerPackage = async (req, res) => {
  try {
    const validation = validatePackage(req.body);
    if (!validation.result) {
      return res.status(400).send({ message: validation.message });
    }

    const package = new Package({
      name: req.body.name,
      time_limit: req.body.time_limit,
      limit_per_patient: req.body.limit_per_patient,
      products: req.body.products
    });

    await package.save();
    res.status(200).send({ message: "Package registered successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.updatePackage = async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    if (!package) {
      return res.status(404).send({ message: "Package not found" });
    }

    const validation = validatePackage(req.body);
    if (!validation.result) {
      return res.status(400).send({ message: validation.message });
    }

    package.name = req.body.name;
    package.time_limit = req.body.time_limit;
    package.limit_per_patient = req.body.limit_per_patient;
    package.products = req.body.products;

    await package.save();
    res.status(200).send({ message: "Package updated successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.deletePackage = async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    if (!package) {
      return res.status(404).send({ message: "Package not found" });
    }
    await package.remove();
    res.status(200).send({ message: "Package deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}