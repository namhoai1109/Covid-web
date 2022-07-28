const router = require("express").Router();
const patientController = require("../controllers/patient.controller");

router.get("/logs", patientController.getLogs);
router.get("/info", patientController.getInfo);
router.put("/password", patientController.changePassword);

// Buy packages
router.post("/buy-package/id=:id", patientController.buyPackage);

module.exports = router;
