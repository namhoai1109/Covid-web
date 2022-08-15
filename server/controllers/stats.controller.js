const StatusStats = require("../models/StatusStats");
const Doctor = require("../models/Doctor");

exports.getStatusStats = async (req, res) => {
  try {
    const statusStats = await StatusStats.find();
    res.send(statusStats);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

