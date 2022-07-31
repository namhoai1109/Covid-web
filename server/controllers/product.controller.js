const Product = require('../models/Product');
const Log = require('../models/Log');
const Account = require('../models/Account');
const Package = require('../models/Package');
const fs = require('fs');

exports.getAllProducts = async (req, res) => {
  try {
    const sortBy = req.query.sort_by || 'price';
    const sortOrder = req.query.sort_order || 'asc';
    const products = await Product.find().sort({ [sortBy]: sortOrder }).exec();
    res.status(200).send(products);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const queryValue = decodeURI(req.query.value);
    const re = new RegExp(queryValue, 'i');
    const products = await Product.find({
      $or: [
        { name: { $regex: re } },
        { quantity_unit: { $regex: re } },
        { type: { $regex: re } },
      ]
    }).sort({ price: 'asc' })
      .exec();

    res.status(200).send(products);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.filterProducts = async (req, res) => {
  try {
    const queryValue = req.query.value;
    const re = new RegExp(queryValue, 'i');
    if (req.query.filter_by === 'price') {
      const ranges = Array.isArray(queryValue) ? queryValue : [queryValue];
      const rangeConversion = {
        'lt-200': { $lt: 200000 },
        '200-500': { $gte: 200000, $lte: 500000 },
        '500-1000': { $gte: 500000, $lte: 1000000 },
        '1000-2000': { $gte: 1000000, $lte: 2000000 },
        '2000-5000': { $gte: 2000000, $lte: 5000000 },
        'gt-5000': { $gt: 5000000 },
      }
      products = await Product.find({
        $or: [
          { price: rangeConversion[ranges[0]] },
          { price: rangeConversion[ranges[1]] },
          { price: rangeConversion[ranges[2]] },
          { price: rangeConversion[ranges[3]] },
          { price: rangeConversion[ranges[4]] },
          { price: rangeConversion[ranges[5]] },
        ]
      }).sort({ price: 'asc' })
        .exec()
    }
    // Filter by field that is not price
    else {
      products = await Product.find({
        [req.query.filter_by]: { $regex: re }
      }).sort({ price: 'asc' })
        .exec()
    }

    res.status(200).send(products);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.registerProduct = async (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    type: req.body.type,
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
    product.type = req.body.type ? req.body.type : product.type;
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