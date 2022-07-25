const Package = require('../models/Package');
const Product = require('../models/Product');

const validatePackage = (package) => {
  if (!package.name) {
    return {
      result: false,
      message: "Name is required"
    };
  }
  if (!package.max) {
    return {
      result: false,
      message: "Max number of products is required"
    };
  }
  if (!package.products) {
    return {
      result: false,
      message: "Products are required"
    };
  }
  if (package.max < 0) {
    return {
      result: false,
      message: "Max number of products must be greater than 0"
    };
  }
  if (package.products.length < 2 || package.products.length > package.max) {
    return {
      result: false,
      message: `Number of products must be between 2 and ${package.max}`
    };
  }

  return {
    result: true,
    message: ""
  }
}

exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find().populate('products');
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
      max: req.body.max,
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
    package.max = req.body.max;
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