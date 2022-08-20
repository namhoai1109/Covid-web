const Facility = require("../models/Facility");
// Create facility
exports.createFacility = async (req, res) => {
  const facility = new Facility({
    name: req.body.name,
    capacity: req.body.capacity,
    current_count: 0,
    location: {
      formattedAddress: `Phuong ${req.body.ward}, Quan ${req.body.district}, TP ${req.body.province}`,
      province: req.body.province,
      district: req.body.district,
      ward: req.body.ward
    }
  });
  if (req.body.current_count) {
    facility.current_count = req.body.current_count;
  }
  try {
    await facility.save();
    res.status(200).send({ message: "Facility created successfully" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
}

// Update facility's information
exports.updateFacility = async (req, res) => {
  try {
    const facility = await Facility.findOne({ _id: req.params.id });
    if (!facility) {
      return res
        .status(400)
        .send({ message: "Facility not found in the database" });
    } else {
      if (req.body.name) {
        facility.name = req.body.name;
      }
      if (req.body.capacity) {
        if (current_count > req.body.capacity) {
          return res.status(500).send({ message: "Capacity is less than current count" });
        }
        facility.capacity = req.body.capacity;
      }
      if (req.body.current_count != null) {
        if (req.body.current_count > facility.capacity) {
          return res.status(500).send({ message: "Capacity is less than current count" });
        }
        facility.current_count = req.body.current_count;
      }
      if (req.body.province) {
        facility.location.province = req.body.province;
      }
      if (req.body.district) {
        facility.location.district = req.body.district;
      }
      if (req.body.ward) {
        facility.location.ward = req.body.ward;
      }
      await facility.save();
      res.status(200).send({ message: "Facility updated successfully" });
    }
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
}

// Sending locations
exports.getProvinces = async (req, res) => {
  try {
    let data = require('./provinces.json');
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
}

// Reading facility's information
exports.readFacilityAll = async (req, res) => {
  try {
    const facilities = await Facility.find();
    res.status(200).send(facilities);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
}

exports.readFacilityOne = async (req, res) => {
  try {
    const facility = await Facility.find({ _id: req.params.id });
    console.log(facility);
    res.status(200).send(facility);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
}

// Delete facility
exports.deleteFacilityOne = async (req, res) => {
  try {
    const facility = await Facility.findOneAndDelete({ _id: req.params.id });
    res.status(200).send({ message: "Facility deleted successfully" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
}

exports.deleteFacilityAll = async (req, res) => {
  try {
    const facilities = await Facility.remove({});
    res.status(200).send({ message: "Facilities deleted successfully" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
}