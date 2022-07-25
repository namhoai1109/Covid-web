const Account = require("../models/Account");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Facility = require("../models/Facility");
const Log = require("../models/Log");
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
    const doctor = await Doctor.findOne({ id_number: req.idNumber });
    if (doctor) {
      doctor.patients.push(patient._id);
      await doctor.save();
    } else {
      return res.status(400).send({ message: "Doctor not found in the database" });
    }

    // Save patient account
    await patient.save();
    await account.save();

    // Create history record
    // const doctorLog = new Log({
    //   account: doctor.account,
    //   action: `Register a new patient: ID: ${patient.id_number}, Name: ${patient.name}`
    // });
    // await doctorLog.save();

    const patientLog = new Log({
      account: patient.account,
      action: 'create',
      description: `Account created by doctor ${doctor.name}`
    });
    await patientLog.save();

    res.status(200).send({ message: "Patient account created and save successfully" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

// Get lists of patients
exports.getAllPatients = async (req, res) => {
  try {
    // Get the doctor by id number
    const doctor = await Doctor.findOne({ id_number: req.idNumber });
    console.log(doctor);
    if (!doctor) {
      return res.status(400).send({ message: "Doctor not found in the database" });
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
    res.status(400).send({ message: err.message });
  }
};

// Update patient's information
exports.updatePatient = async (req, res) => {
  try {
    // Check if the patient is in the doctor's list
    const isBelong = await isBelongToDoctor(req.idNumber, req.params.id);
    if (!isBelong.result) {
      return res.status(500).send({ message: isBelong.message });
    }
    patient = isBelong.patient;
    doctor = isBelong.doctor;

    const statusNumber = Number(patient.status[1]); //0, 1, 2, 3
    const newStatusNumber = Number(req.body.status?.[1]); //0, 1, 2, 3
    const step = newStatusNumber - statusNumber;

    // Create history record
    const facility = await Facility.findOne({ _id: patient.current_facility });
    statusString = ""
    if (req.body.status && req.body.status !== patient.status) {
      statusString += `Status changed to ${req.body.status}\n`;
    }
    if (req.body.current_facility && req.current_facility !== patient.current_facility) {
      statusString += `Current facility changed to ${facility.name}\n`;
    }
    if (statusString) {
      const patientLog = new Log({
        account: patient.account,
        action: 'update',
        description: statusString + `Updated by doctor ${doctor.name}`
      });
      await patientLog.save();
    }

    // Update patient's text information
    patient.status = req.body.status ? req.body.status : patient.status;
    patient.close_contact_list = req.body.close_contact_list ? req.body.close_contact_list : patient.close_contact_list;
    patient.current_facility = req.body.current_facility ? req.body.current_facility : patient.current_facility;
    await patient.save();

    // Create history record


    // Update contact list status
    const contactListID = patient.close_contact_list;
    const contactList = await Patient.find().where("_id").in(contactListID);
    contactList.forEach(async (patient) => {
      if (patient.status !== "F0") {
        const statusNumber = Number(patient.status[1]); //0, 1, 2, 3
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
    res.status(500).send({ message: err.message });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    // Check if the patient is in the doctor's list
    const isBelong = await isBelongToDoctor(req.idNumber, req.params.id);
    if (!isBelong.result) {
      return res.status(500).send({ message: isBelong.message });
    }
    patient = isBelong.patient;
    doctor = isBelong.doctor;

    // Delete the patient account
    const account = await Account.findOne({ _id: patient.account });
    if (!account) {
      return res.status(500).send({ message: "Patient account not found to perform deletion" });
    }
    await account.remove();

    // Delete the patient from database and from doctor's managed list
    const trashID = patient._id;
    doctor.patients.pull(patient._id);
    await doctor.save();
    await patient.remove();
    await clearContactListTrashID(trashID);

    // Delete history records
    await Log.deleteMany({ account: account._id });

    res.status(200).send({ message: "Patient deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

// Helper function to check if the patient is in the doctor's list
const isBelongToDoctor = async (doctorID, patientID) => {
  const currentDoctor = await Doctor.findOne({ id_number: doctorID }).populate("patients", "id_number");
  if (!currentDoctor) {
    return {
      result: false,
      message: "Requesting doctor not found in the database",
    }
  }

  const patient = await Patient.findOne({ _id: patientID });
  if (!patient) {
    return {
      result: false,
      message: "Patient not found in the database",
    }
  }

  const is_exist = currentDoctor.patients.find(p => p.id_number === patient.id_number);
  if (!is_exist) {
    return {
      result: false,
      message: "Patient not belong to doctor",
    }
  }

  return {
    result: true,
    message: "",
    patient: patient,
    doctor: currentDoctor,
  }
}


// Helper function for clearing up trashID in every patient's contact list after deletion a patient
const clearContactListTrashID = async (trashID) => {
  const patients = await Patient.find();
  patients.forEach(async (patient) => {
    if (patient.close_contact_list.includes(trashID)) {
      patient.close_contact_list.pull(trashID);
      await patient.save();
    }
  });
}