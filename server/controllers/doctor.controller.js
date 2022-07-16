const Account = require("../models/Account");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Necessity = require("../models/Necessity");
const bcrypt = require("bcryptjs");

// *Patients related
// Register a new patient
exports.registerAccount = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const account = new Account({
    username: req.body.username,
    password: hashedPassword,
    role: "patient",
  });

  const patient = new Patient({
    account: account._id,
    id_number: req.body.username,
    name: req.body.name,
    DOB: req.body.DOB,
    address: req.body.address,
    status: req.body.status,
    current_facility: req.body.currentFacility,
    close_contact_list: req.body.closeContactList,
  });

  try {
    // Add patients to doctor managed list.
    const doctor = await Doctor.findOne({ username: req.idNumber });
    if (doctor) {
      doctor.patients.push(patient._id);
      await doctor.save();
    } else {
      return res.status(400).send({ message: "Doctor not found" });
    }

    // Save patient account
    await account.save();
    await patient.save();

    res
      .status(200)
      .send({ message: "Patient account created and save successfully" });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

// Get lists of patients
exports.getAllPatients = async (req, res) => {
  try {
    // Get the doctor by id number
    const doctor = await Doctor.findOne({ username: req.idNumber });
    if (!doctor) {
      return res.status(400).send("Doctor not found");
    }

    // Get the patients by doctor's managed list
    const patientsID = doctor.patients;
    const patients = await Patient.find()
      .where("_id")
      .in(patientsID)
      .populate("account", "username role status")
      .populate("current_facility", "name")
      .populate(
        "close_contact_list",
        "_id id_number name DOB status current_facility"
      );
    res.status(200).send(patients);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

// Update patient's information (not include covid status)
exports.updatePatient = async (req, res) => {
  // Get the patients list of current doctor
  try {
    const currentDoctor = await Doctor.findOne({
      username: req.idNumber,
    }).populate("patients", "id_number");
    if (!currentDoctor) {
      return res.status(400).send({ message: "Requesting username not found" });
    }

    // Get the patient by id_number params
    const patient = await Patient.findOne({ id_number: req.params.id });
    if (!patient) {
      return res.status(400).send({ message: "Patient not found" });
    }

    const is_exist = currentDoctor.patients.find(
      (p) => p.id_number === patient.id_number
    );
    if (!is_exist) {
      return res
        .status(400)
        .send({ message: "Patient not found in the management list" });
    }

    const statusNumber = Number(patient.status[1]); //0, 1, 2, 3
    const newStatusNumber = Number(req.body.status?.[1]); //0, 1, 2, 3
    const step = newStatusNumber - statusNumber;

    // Update patient's information
    patient.status = req.body.status ? req.body.status : patient.status;
    patient.close_contact_list = req.body.closeContactList ? req.body.closeContactList : patient.close_contact_list;
    patient.current_facility = req.body.currentFacility ? req.body.currentFacility : patient.current_facility;
    await patient.save();

    // Update contact list status
    const contactListID = patient.close_contact_list;
    const contactList = await Patient.find().where("_id").in(contactListID);
    console.log(contactList);

    contactList.forEach(async (patient) => {
      if (patient.status !== "F0") {
        const statusNumber = Number(patient.status[1]); //0, 1, 2, 3
        console.log(statusNumber);
        let newStatusNumber = statusNumber + step;
        if (newStatusNumber < 0) {
          newStatusNumber = 0;
        }
        if (newStatusNumber > 3) {
          newStatusNumber = 3;
        }
        patient.status = `F${newStatusNumber}`;
        await patient.save();
      }
    });
    res.status(200).send({ message: "Patient updated successfully" });
  } catch (err) {
    res.status(500).send({ message: "Something went wrong" });
  }
};

const deletePatient = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ username: req.idNumber });
    if (!doctor) {
      return res.status(400).send("Doctor not found");
    }

    const patient = await Patient.findOne({ id_number: req.params.id });
    if (!patient) {
      return res.status(400).send("Patient not found");
    }

    const is_exist = doctor.patients.find(
      (p) => p.id_number === patient.id_number
    );
    if (!is_exist) {
      return res
        .status(400)
        .send({ message: "Patient not found in the management list" });
    }

    doctor.patients.pull(patient._id);
    await doctor.save();
    await patient.remove();
    res.status(200).send({ message: "Patient deleted successfully" });
  } catch (err) {
    res.status(400).send(err.message);
  }
}

// Disable or enable a patient account
// exports.editAccount = async (req, res) => {
//   Account.findOneAndUpdate({ username: req.params.id }, req.body, {
//     UseFindAndModify: false,
//   })
//     .then((data) => {
//       if (!data) {
//         res.status(404).send("Patient cccount not found");
//       } else {
//         res.status(200).send("Account updated successfully");
//       }
//     })
//     .catch((err) => {
//       res.status(400).send({ message: err });
//     });
// };

// TODO: Update status and contaced list
// exports.editStatus = async (req, res) => {
//   try {
//     const patient = await Patient.findOne({ id_number: req.params.id });
//     if (!patient) {
//       res.status(404).send("Patient not found");
//     } else {
//       patient.status = req.body.status;
//       await patient.save();
//       res.status(200).send("Patient status updated successfully");
//     }
//   } catch (err) {
//     res.status(400).send({message: err });
//   }
// };

// *Necessities related
exports.registerNecessity = async (req, res) => {
  const necessity = new Necessity({
    name: req.body.name,
    price: req.body.price,
    quantity_unit: req.body.quantity_unit,
    images: req.body.images,
  });

  try {
    const doctor = await Doctor.findOne({ username: req.idNumber });
    if (!doctor) {
      return res.status(400).send("Doctor not found");
    }

    doctor.necessities.push(necessity._id);
    await necessity.save();
    await doctor.save();
    res.status(200).send({ message: "Necessity registered successfully" });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.updateNecessity = async (req, res) => {
  Necessity.findOneAndUpdate({ _id: req.params.id }, req.body, {
    UseFindAndModify: false,
  })
    .then((data) => {
      if (!data) {
        res.status(404).send("Necessity not found");
      } else {
        res.status(200).send("Necessity updated successfully");
      }
    })
    .catch((err) => {
      res.status(400).send({ message: err });
    });
};

exports.getAllNecessities = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ username: req.idNumber });
    if (!doctor) {
      return res.status(400).send("Doctor not found");
    }
    const necessitiesID = doctor.necessities;
    const necessity = await Necessity.find().where("_id").in(necessitiesID);
    res.status(200).send(necessity);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.deleteNecessity = async (req, res) => {
  // Delete the necessity
  Necessity.findOneAndDelete({ _id: req.params.id })
    .then((data) => {
      if (!data) {
        res.status(404).send("Necessity not found");
      } else {
        res.status(200).send("Necessity deleted successfully");
      }
    })
    .catch((err) => {
      res.status(400).send({ message: err });
    });

  // Delete the necessity id from doctor's managed list
  try {
    const doctor = await Doctor.findOne({ username: req.idNumber });
    if (!doctor) {
      return res.status(400).send("Doctor not found");
    }
    doctor.necessities.pull(req.params.id);
    await doctor.save();
  } catch (err) {
    res.status(400).send(err.message);
  }
};
