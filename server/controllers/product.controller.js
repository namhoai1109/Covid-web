const Product = require('../models/Product');
const Log = require('../models/Log');
const Account = require('../models/Account');
const Package = require('../models/Package');
const fs = require('fs');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
    res.status(200).send(products);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

exports.registerProduct = async (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    quantity_unit: req.body.quantity_unit,
    images: req.file?.path || req.files?.map((file) => file.path),
  });

  try {
    // Create history records for doctor
    const account = await Account.findOne({ username: req.idNumber });
    const log = new Log({
      account: account._id,
      action: 'create',
      description: `Registered a new product: ${product.name}`
    })
    await log.save();

    await product.save();
    res.status(200).send({ message: "Product registered successfully" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ message: "Product not found in the database" });
    }

    // Create history records for doctor
    const account = await Account.findOne({ username: req.idNumber });
    const log = new Log({
      account: account._id,
      action: 'update',
      description: `Updated product: ${product.name}`
    });
    await log.save();

    // Update text fields
    product.name = req.body.name ? req.body.name : product.name;
    product.price = req.body.price ? req.body.price : product.price;
    product.quantity_unit = req.body.quantity_unit ? req.body.quantity_unit : product.quantity_unit;

    // Update delete images
    // Remove from product's images and from filesystem
    let deleteImages;
    if (!Array.isArray(req.body.deletions)) {
      deleteImages = [req.body.deletions];
    } else {
      deleteImages = req.body.deletions;
    }

    if (deleteImages) {
      deleteImages.forEach((image) => {
        const index = product.images.indexOf(image);
        if (index > -1) {
          product.images.splice(index, 1);
          fs.unlink(image, (err) => {
            if (err) { console.log(err); }
          });
        }
      });
    }

    // Update new images by pushing them to product's images
    if (req.file || req.files) {
      const newImages = req.file?.path || req.files?.map((file) => file.path);
      if (newImages) {
        newImages.forEach((image) => {
          product.images.push(image);
        });
      }
    }

    await product.save();
    res.status(200).send({ message: "Product updated successfully" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    // Create history records for doctor
    const account = await Account.findOne({ username: req.idNumber });
    const log = new Log({
      account: account._id,
      action: 'delete',
      description: `Deleted product: ${product.name}`
    })
    await log.save();

    const images = product.images;
    if (images) {
      images.forEach((image) => {
        fs.unlink(image, (err) => {
          if (err) { console.log(err); }
        });
      });
    }

    const packages = await Package.find();
    if (packages) {
      packages.forEach(async (package) => {
        const index = package.products.findIndex((product) => product.product.toString() === req.params.id);
        if (index > -1) {
          package.products.splice(index, 1);
          await package.save();
        }
      });

    }

    await product.remove();
    res.status(200).send({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};