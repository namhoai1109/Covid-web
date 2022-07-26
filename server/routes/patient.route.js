const router = require("express").Router();
const patientController = require("../controllers/patient.controller");

router.get("/logs", patientController.getLogs);

module.exports = router;
