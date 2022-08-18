const Account = require("../models/Account");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Facility = require("../models/Facility");
const Log = require("../models/Log");
const StatusStats = require("../models/StatusStats");
const bcrypt = require("bcryptjs");

// Register a new patient
exports.registerAccount = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ id_number: req.idNumber });
        if (!doctor) {
            return res
                .status(500)
                .send({ message: "Doctor not found in the database" });
        }

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
            credit_limit: doctor.credit_limit,
        });

        // Save patient account
        account.save();
        patient.save();

        // Add patients to doctor managed list.
        doctor.patients.push(patient._id);
        await doctor.save();

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
        // Find the latest recent status stats
        const recentStatusStats = await StatusStats.find()
            .sort({ date: -1 })
            .limit(1);
        const todayStatusStats = await StatusStats.findOne({
            date: new Date().toISOString().slice(0, 10),
        });
        if (recentStatusStats.length > 0) {
            if (todayStatusStats) {
                // Increment the patient status
                todayStatusStats[patient.status] += 1;
                await todayStatusStats.save();
            } else {
                const newStatusStats = new StatusStats({
                    date: new Date().toISOString().slice(0, 10),
                });
                newStatusStats[patient.status] += 1;
                newStatusStats["F0"] += recentStatusStats[0]["F0"];
                newStatusStats["F1"] += recentStatusStats[0]["F1"];
                newStatusStats["F2"] += recentStatusStats[0]["F2"];
                newStatusStats["F3"] += recentStatusStats[0]["F3"];

                await newStatusStats.save();
            }
        }
        // If there is no status stats record, create one
        else {
            const newStatusStats = new StatusStats({
                date: new Date().toISOString().slice(0, 10),
            });
            newStatusStats[patient.status] += 1;
            await newStatusStats.save();
        }

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
                ],
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
                ],
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
        const patient = isBelong.patient;
        const doctor = isBelong.doctor;

        // Declare a log string variable for history record
        let logString = "";

        // Variables needed to update close contact list status
        const statusNumber = Number(patient.status[1]); //0, 1, 2, 3
        const newStatusNumber = req.body.status
            ? Number(req.body.status[1])
            : statusNumber; //0, 1, 2, 3
        const step = newStatusNumber - statusNumber;

        // Update patient's status
        if (req.body.status) {
            patient.status = req.body.status;
            logString += `Status changed to ${patient.status} | `;
        }

        // Update status statistics
        const recentStatusStats = await StatusStats.find()
            .sort({ date: -1 })
            .limit(1);
        let todayStatusStats = await StatusStats.findOne({
            date: new Date().toISOString().slice(0, 10),
        });

        if (todayStatusStats) {
            // Increment the patient status
            todayStatusStats[`F${newStatusNumber}`] += 1;
            todayStatusStats[`F${statusNumber}`] -= 1;
        } else {
            todayStatusStats = new StatusStats({
                date: new Date().toISOString().slice(0, 10),
            });
            todayStatusStats[`F${newStatusNumber}`] += 1;
            todayStatusStats[`F${statusNumber}`] -= 1;
            todayStatusStats["F0"] += recentStatusStats[0]["F0"];
            todayStatusStats["F1"] += recentStatusStats[0]["F1"];
            todayStatusStats["F2"] += recentStatusStats[0]["F2"];
            todayStatusStats["F3"] += recentStatusStats[0]["F3"];
            await todayStatusStats.save();
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

                    logString += `Changed current facility to ${newFacility.name} | `;
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
        contactList.forEach((patient) => {
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
                patient.save();

                // Update status statistics only if the status has changed
                todayStatusStats[patient.status] += 1;
                todayStatusStats[`F${statusNumber}`] -= 1;

                // Create history record for patients in contact list
                const patientLog = new Log({
                    account: patient.account,
                    action: "update",
                    description: `Status changed to ${patient.status} due to close contact`,
                });
                patientLog.save();
            }
        });
        await todayStatusStats.save();

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
        const patient = isBelong.patient;
        const doctor = isBelong.doctor;

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

        // Update status statistic
        // Find the latest recent status stats
        const recentStatusStats = await StatusStats.find()
            .sort({ date: -1 })
            .limit(1);
        let todayStatusStats = await StatusStats.findOne({
            date: new Date().toISOString().slice(0, 10),
        });
        if (todayStatusStats) {
            // Decrement the patient status
            todayStatusStats[patient.status] -= 1;
        } else {
            todayStatusStats = new StatusStats({
                date: new Date().toISOString().slice(0, 10),
            });
            todayStatusStats[patient.status] -= 1;
            todayStatusStats["F0"] += recentStatusStats[0]["F0"];
            todayStatusStats["F1"] += recentStatusStats[0]["F1"];
            todayStatusStats["F2"] += recentStatusStats[0]["F2"];
            todayStatusStats["F3"] += recentStatusStats[0]["F3"];
        }
        await todayStatusStats.save();

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

// ----------------------Credit limit related functions-----------------------
// Get the current credit limit
exports.getCurrentCreditLimit = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ id_number: req.idNumber });
    if (!doctor) {
      return res.status(500).send({ message: "Doctor not found" });
    }

    res.status(200).send({ credit_limit: doctor.credit_limit });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

// Update the credit limit
exports.updateCreditLimit = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ id_number: req.idNumber });
    if (!doctor) {
      return res.status(500).send({ message: "Doctor not found" });
    }
    
        // Check if the credit limit is valid
        if (req.body.credit_limit < 0 || req.body.credit_limit > 1) {
            return res.status(400).send({
                message:
                    "Credit limit must be positive and/or smaller than 100%",
            });
        }

        // Update credit limit of doctor
        doctor.credit_limit = req.body.credit_limit;
        await doctor.save();

        // Update credit limit for patient in list
        const patients = await Patient.find().where("_id").in(doctor.patients);
        patients.forEach((patient) => {
            patient.credit_limit = req.body.credit_limit;
            patient.save();
        });

        res.status(200).send({ message: "Credit limit updated successfully" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

// Get list of patients with account payment system
// TODO: Get money of patients in the list
exports.getPatientsWithPSAccount = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ id_number: req.idNumber });
    if (!doctor) {
      return res.status(500).send({ message: "Doctor not found" });
    }

    const patients = await Patient.aggregate([
      { $match: { _id: { $in: doctor.patients } } },
      {
        $lookup: {
          from: Account.collection.name,
          localField: "account",
          foreignField: "_id",
          as: "account",
        }

        const patients = await Patient.aggregate([
            { $match: { _id: { $in: doctor.patients } } },
            {
                $lookup: {
                    from: Account.collection.name,
                    localField: "account",
                    foreignField: "_id",
                    as: "account",
                },
            },
            { $unwind: "$account" },
            { $match: { "account.linked": { $eq: true } } },
        ]);

        res.status(200).send(patients);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

// --------------------------------Helper functions-----------------------------
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
