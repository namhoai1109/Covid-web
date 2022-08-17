const router = require("express").Router();
const { checkLinkedAccount, checkPaymentAccountExist } = require("../middlewares/auth");
const patientController = require("../controllers/patient.controller");
const packageController = require("../controllers/package.controller");

router.get("/logs", patientController.getLogs);
router.get("/info", patientController.getInfo);
router.get("/packages", packageController.getAllPackages);
router.put("/password", patientController.changePassword);
router.put("/link", checkPaymentAccountExist, patientController.linkAccount);
router.post("/buy-package/id=:id", checkLinkedAccount, patientController.buyPackage);

module.exports = router;
