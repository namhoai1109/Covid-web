const Package = require('../models/Package');
const Product = require('../models/Product');

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
    if (!req.body.max) {
      return res.status(400).send({ message: "Max number of products is required" });
    }
    if (req.body.max < 0) {
      return res.status(400).send({ message: "Max number of products must be greater than 0" });
    }
    if (req.body.products.length < 2 || req.body.products.length > req.body.max) {
      return res.status(400).send({ message: `Number of products must be between 2 and ${req.body.max}` });
    }
    const package = new Package({
      name: req.body.name,
      max: req.body.max,
    });
    await package.save();
    res.status(200).send({ message: "Package registered successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }

}