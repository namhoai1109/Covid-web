const Account = require("../models/Account");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Facility = require("../models/Facility");
const Log = require("../models/Log");
const StatusStats = require("../models/StatusStats");
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
    dob: req.body.dob,
    address: req.body.address,
    status: req.body.status,
    current_facility: req.body.current_facility,
    close_contact_list: req.body.close_contact_list,
  });

  try {
    // Add patients to doctor managed list.
    const doctor = await Doctor.findOne({ id_number: req.idNumber });
    if (doctor) {
      doctor.patients.push(patient._id);
      await doctor.save();
    } else {
      return res
        .status(400)
        .send({ message: "Doctor not found in the database" });
    }

    // Save patient account
    await patient.save();
    await account.save();

    // Create history record for doctor
    const doctorLog = new Log({
      account: doctor.account,
      action: "create",
      description: `Registered a new patient: ID: ${patient.id_number}, Name: ${patient.name}`,
    });
    await doctorLog.save();

    // Create history record for patient
    const patientLog = new Log({
      account: patient.account,
      action: "create",
      description: `Account created by doctor ${doctor.name}`,
    });
    await patientLog.save();

    // Update status statistic
    await StatusStats.updateOne(
      {
        date: new Date().toISOString().slice(0, 10)
      },
      {
        $inc: { [patient.status]: 1 },
      },
      {
        upsert: true,
      }
    )

    res.status(200).send({
      message: "Patient account created and save successfully",
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

// Get lists of patients
exports.getAllPatients = async (req, res) => {
  try {
    // Get the doctor by id number
    const doctor = await Doctor.findOne({ id_number: req.idNumber });
    if (!doctor) {
      return res
        .status(500)
        .send({ message: "Doctor not found in the database" });
    }

    // Get the patients by doctor's managed list
    const sortBy = req.query.sort_by || "id_number";
    const sortOrder = req.query.sort_order || "asc";
    const patientsID = doctor.patients;
    const patients = await Patient.find({ _id: { $in: patientsID } })
      .populate("account", "username role status")
      .populate("current_facility")
      .populate({
        path: "close_contact_list",
        populate: {
          path: "current_facility",
          model: "Facility",
        },
        select: "id_number name dob status current_facility",
      })
      .sort({
        [sortBy]: sortOrder,
      })
      .exec();

    res.status(200).send(patients);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

exports.searchPatients = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ id_number: req.idNumber });
    if (!doctor) {
      return res
        .status(500)
        .send({ message: "Doctor not found in the database" });
    }
    const queryValue = req.query.value;
    const re = new RegExp(queryValue, "i");
    const patients = await Patient.find({
      _id: { $in: doctor.patients },
    })
      .populate("account", "username role status")
      .populate("current_facility")
      .populate({
        path: "close_contact_list",
        populate: {
          path: "current_facility",
          model: "Facility",
        },
        select: "id_number name dob status current_facility",
      })
      .where({
        $or: [
          { id_number: { $regex: re } },
          { name: { $regex: re } },
          { address: { $regex: re } },
          { status: { $regex: re } },
          { dob: { $regex: re } },
        ]
      })
      .sort({ id_number: "asc" })
      .exec();

    res.status(200).send(patients);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.filterPatients = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ id_number: req.idNumber });
    if (!doctor) {
      return res
        .status(500)
        .send({ message: "Doctor not found in the database" });
    }

    const queryValue = req.query.value;
    const filterBy = Array.isArray(req.query.filter_by)
      ? req.query.filter_by
      : [req.query.filter_by];
    const filterValues = Array.isArray(queryValue)
      ? queryValue
      : [queryValue];
    values = filterValues.map((value) => ({
      $regex: new RegExp(value, "i"),
    }));

    const patients = await Patient.find({
      _id: { $in: doctor.patients },
    })
      .populate("account", "username role status")
      .populate("current_facility")
      .populate({
        path: "close_contact_list",
        populate: {
          path: "current_facility",
          model: "Facility",
        },
        select: "id_number name dob status current_facility",
      })
      .where({
        $and: [
          { [filterBy[0]]: values[0] },
          { [filterBy[1]]: values[1] },
          { [filterBy[2]]: values[2] },
          { [filterBy[3]]: values[3] },
          { [filterBy[4]]: values[4] },
        ]
      })
      .sort({ id_number: "asc" })
      .exec();

    res.status(200).send(patients);
  } catch (err) {
    res.status(500).send({ message: err.message });
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

    // Declare a log string variable for history record
    let logString = "";

    // Variables needed to update close contact list status
    const statusNumber = Number(patient.status[1]); //0, 1, 2, 3
    const newStatusNumber = req.body.status ? Number(req.body.status[1]) : statusNumber; //0, 1, 2, 3
    const step = newStatusNumber - statusNumber;

    // Update patient's status
    if (req.body.status) {
      patient.status = req.body.status;
      logString += `Status changed to ${patient.status}\n`;
    }

    // Update status statistics
    // Step !== 0 means the status has changed
    if (step !== 0) {
      await StatusStats.updateOne(
        {
          date: new Date().toISOString().slice(0, 10),
        },
        {
          $inc: {
            [`F${newStatusNumber}`]: 1,
            [`F${statusNumber}`]: -1,
          },
        },
        { upsert: true }
      )
    }

    // Update patient's contact list
    patient.close_contact_list = req.body.close_contact_list
      ? req.body.close_contact_list
      : patient.close_contact_list;

    // Change patient's current facility
    if (req.body.current_facility) {
      const newFacility = await Facility.findOne({
        _id: req.body.current_facility,
      });
      if (newFacility) {
        if (newFacility.current_count < newFacility.capacity) {
          newFacility.current_count++;
          await newFacility.save();
          patient.current_facility = newFacility._id;

          logString += `Changed current facility to ${newFacility.name}\n`;
        } else {
          return res.status(400).send({
            message: "New facility has reached maximum capacity",
          });
        }
      }
    }
    // Save patient to database
    await patient.save();

    // Update each patient's status in contact list
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

        // Update status statistics only if the status has changed
        if (newStatusNumber !== statusNumber) {
          await StatusStats.updateOne(
            {
              date: new Date().toISOString().slice(0, 10),
            },
            {
              $inc: {
                [`F${newStatusNumber}`]: 1,
                [`F${statusNumber}`]: -1,
              },
            },
            { upsert: true }
          )
        }

        // Create history record for patients in contact list
        const patientLog = new Log({
          account: patient.account,
          action: "update",
          description: `Status changed to ${patient.status} due to close contact`,
        });
        await patientLog.save();
      }
    });

    // Create history record for patient
    if (logString) {
      const patientLog = new Log({
        account: patient.account,
        action: "update",
        description: logString + `Updated by doctor ${doctor.name}`,
      });
      await patientLog.save();
    }
    // Create history record for doctor
    const doctorLog = new Log({
      account: doctor.account,
      action: "update",
      description: `Updated patient: ID: ${patient.id_number}, Name: ${patient.name}`,
    });
    await doctorLog.save();

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

    // Create history record for doctor
    const doctorLog = new Log({
      account: doctor.account,
      action: "delete",
      description: `Deleted patient: ID: ${patient.id_number}, Name: ${patient.name}`,
    });
    await doctorLog.save();

    // Delete the patient account
    const account = await Account.findOne({ _id: patient.account });
    if (!account) {
      return res.status(500).send({
        message: "Patient account not found to perform deletion",
      });
    }
    await account.remove();

    // Decrement current count of status statistics
    await StatusStats.updateOne(
      {
        date: new Date().toISOString().slice(0, 10),
      },
      {
        $inc: {
          [`F${patient.status[1]}`]: -1,
        },
      }
    );

    // Delete the patient from database and from doctor's managed list
    const trashID = patient._id;
    doctor.patients.pull(patient._id);
    await doctor.save();
    await patient.remove();
    await clearContactListTrashID(trashID);

    // Delete history records of deleted patient
    await Log.deleteMany({ account: account._id });

    res.status(200).send({ message: "Patient deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Helper function to check if the patient is in the doctor's list
const isBelongToDoctor = async (doctorID, patientID) => {
  const currentDoctor = await Doctor.findOne({
    id_number: doctorID,
  }).populate("patients", "id_number");
  if (!currentDoctor) {
    return {
      result: false,
      message: "Requesting doctor not found in the database",
    };
  }

  const patient = await Patient.findOne({ _id: patientID });
  if (!patient) {
    return {
      result: false,
      message: "Patient not found in the database",
    };
  }

  const is_exist = currentDoctor.patients.find(
    (p) => p.id_number === patient.id_number,
  );
  if (!is_exist) {
    return {
      result: false,
      message: "Patient not belong to doctor",
    };
  }

  return {
    result: true,
    message: "",
    patient: patient,
    doctor: currentDoctor,
  };
};

// Helper function for clearing up trashID in every patient's contact list after deletion a patient
const clearContactListTrashID = async (trashID) => {
  const patients = await Patient.find();
  patients.forEach(async (patient) => {
    if (patient.close_contact_list.includes(trashID)) {
      patient.close_contact_list.pull(trashID);
      await patient.save();
    }
  });
};


