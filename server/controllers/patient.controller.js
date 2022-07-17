const Account = require("../models/Account");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const bcrypt = require("bcryptjs");

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

    res.status(200).send({ message: "Patient account created and save successfully" });
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
    const currentDoctor = await Doctor.findOne({ username: req.idNumber, }).populate("patients", "id_number");
    if (!currentDoctor) {
      return res.status(400).send({ message: "Requesting username not found" });
    }

    // Get the patient by id_number params
    const patient = await Patient.findOne({ id_number: req.params.id });
    if (!patient) {
      return res.status(400).send({ message: "Patient not found" });
    }

    const is_exist = currentDoctor.patients.find(p => p.id_number === patient.id_number);
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
    res.status(400).send({ message: "Something went wrong" });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ username: req.idNumber }).populate("patients", "id_number");
    if (!doctor) {
      return res.status(400).send("Doctor not found");
    }

    const patient = await Patient.findOne({ id_number: req.params.id });
    if (!patient) {
      return res.status(400).send("Patient not found");
    }

    const is_exist = doctor.patients.find(p => p.id_number === patient.id_number);
    if (!is_exist) {
      return res
        .status(400)
        .send({ message: "Patient not found in the management list" });
    }

    // Delete the patient account
    const account = await Account.findOne({ _id: patient.account });
    if (!account) {
      return res.status(400).send({ message: "Patient account not found to perform deletion" });
    }
    await account.remove();

    // Delete the patient from database and from doctor's managed list
    const trashID = patient._id;
    doctor.patients.pull(patient._id);
    await doctor.save();
    await patient.remove();
    clearContactListTrashID(trashID);

    res.status(200).send({ message: "Patient deleted successfully" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
}

// Additional function for clearing up trashID in every patient's contact list after deletion a patient
const clearContactListTrashID = async (trashID) => {
  const patients = await Patient.find();
  patients.forEach(async (patient) => {
    if (patient.close_contact_list.includes(trashID)) {
      patient.close_contact_list.pull(trashID);
      await patient.save();
    }
  });
}