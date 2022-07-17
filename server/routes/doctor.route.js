const router = require("express").Router();
const controller = require("../controllers/doctor.controller");

// Patients related
router.put("/patients/id=:id", controller.updatePatient);
router.delete("/patients/id=:id", controller.deletePatient);
router.post("/patients", controller.registerAccount);
router.get("/patients", controller.getAllPatients);

// Necessities related
router.get("/necessities", controller.getAllNecessities);
router.post("/necessities", controller.registerNecessity);
router.put("/necessities/id=:id", controller.updateNecessity);
router.delete("/necessities/id=:id", controller.deleteNecessity);

module.exports = router;
