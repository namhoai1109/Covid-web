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
const PackageStats = require("../models/PackageStats");
const ProductStats = require("../models/ProductStats");

exports.getLogs = async (req, res) => {
  try {
    const patient = await Patient.findOne({ id_number: req.idNumber });
    if (!patient) {
      return res
        .status(500)
        .send({ message: "Patient not found in the database" });
    }
    const logs = await Log.find({ account: patient.account }).sort({ time: -1 });
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
    if (!req.body.old_password || !req.body.new_password) {
      return res.status(500).send({ message: "Missing parameters" });
    }

    const patient = await Patient.findOne({
      id_number: req.idNumber,
    }).populate("account");
    if (!patient) {
      return res
        .status(500)
        .send({ message: "Patient not found in the database" });
    }

    // Check old password
    const oldPassword = req.body.old_password;
    const isMatch = await bcrypt.compare(
      oldPassword,
      patient.account.password,
    );
    if (!isMatch) {
      return res
        .status(401)
        .send({ message: "Old password is incorrect" });
    }

    // Hash new password and update
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
    const firstOrder = await Bill.findOne({
      buyer: patient._id,
      package: package._id,
      paid: true
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
    const orders = await Bill.find({
      buyer: patient._id,
      package: package._id,
      paid: true,
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

    productsToBuy.forEach((product) => {
      const productInPackage = productsInPackage.find((p) => {
        return p.product._id.toString() === product.id.toString();
      });
      if (!productInPackage) {
        throw Error("Product not found in the package");
      }
      if (product.quantity > productInPackage.quantity) {
        throw Error(
          `Not enough quantity of product ${productInPackage.product.name}`,
        );
      }

      productsToBuyInfo.push({
        product: productInPackage.product._id,
        quantity: product.quantity,
      });

      total_price += productInPackage.product.price * product.quantity;
    });

    const credit_limit = patient.credit_limit;
    const order_bill = new Bill({
      buyer: patient._id,
      buyer_username: patient.id_number,
      package: package._id,
      time_buy: Date.now(),
      products_info: productsToBuyInfo,
      credit_limit: credit_limit,
      total_price: total_price,
      paid: false,
    });

    // Save bill to database
    await order_bill.save();
    const bill = await Bill.findOne(
      { _id: order_bill._id },
      { buyer_username: 0 },
    )
      .populate({
        path: "buyer",
        select: "name id_number",
      })
      .populate({
        path: "package",
        select: "name",
      })
      .populate({
        path: "products_info.product",
        select: "name price",
      });

    // Send bill to patient
    res.status(200).send({
      message: "Bill created successfully",
      bill: bill,
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
  if (bill.paid) {
    return res.status(500).send({ message: "Bill already paid" });
  }

  axios
    .post(PSURL, bill)
    .then(async (response) => {
      bill.paid = true;
      await bill.save();

      // Save package stats
      await PackageStats.updateOne(
        {
          package: bill.package,
          date: bill.time_buy.toISOString().slice(0, 10)
        },
        { $inc: { count: 1 } },
        { upsert: true }
      )

      // Save product stats
      const products = bill.products_info;
      products.forEach(async (product) => {
        await ProductStats.updateOne(
          {
            product: product.product,
            date: bill.time_buy.toISOString().slice(0, 10)
          },
          { $inc: { count: product.quantity } },
          { upsert: true }
        )
      })

      res.status(200).send({ message: "Bill paid, order successful, package usage saved" });
    })
    .catch(async (err) => {
      console.log(err);
      await bill.remove();
      res.status(500).send(err.response.data);
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

    const paySysURL = `https://localhost:${process.env.PAYMENT_SYSTEM_PORT}/api/main/register`;
    const token = req.headers.authorization;
    axios({
      method: "POST",
      url: paySysURL,
      headers: {
        'Authorization': token,
      },
      data: {
        username: account.username,
        password: "placeholder",
      },
    })
      .then(response => {
        account.linked = true;
        account.save();
        res.status(200).send({ message: "Account linked successfully" });
      })
      .catch(error => {
        res.status(500).send({ message: "Error linking account" });
      });

  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
