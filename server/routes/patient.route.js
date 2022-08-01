const router = require("express").Router();
const patientController = require("../controllers/patient.controller");
const packageController = require("../controllers/package.controller");

router.get("/logs", patientController.getLogs);
router.get("/info", patientController.getInfo);
router.get("/packages", packageController.getAllPackages);
router.put("/password", patientController.changePassword);

// Buy packages
router.post("/buy-package/id=:id", patientController.buyPackage);

module.exports = router;
