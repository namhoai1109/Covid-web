const router = require("express").Router();
const {
  checkLinkedAccount,
  checkPaymentAccountExist,
} = require("../middlewares/auth");
const patientController = require("../controllers/patient.controller");
const packageController = require("../controllers/package.controller");

// Logs related
router.get("/logs", patientController.getLogs);
router.get("/paid-packages-logs", patientController.getPaidPackageLog);

// Info related
router.get("/info", patientController.getInfo);
router.put("/password", patientController.changePassword);
router.delete("/debt-noti", patientController.deleteDebtNotification);
router.put("/link", checkPaymentAccountExist, patientController.linkAccount);

// Package related
router.get("/packages", packageController.getAllPackages);
router.get("/packages/search", packageController.searchPackages);
router.get("/packages/filter", packageController.filterPackages);
router.post("/buy-package/id=:id", checkLinkedAccount, patientController.buyPackage);

// Bill related
router.delete("/delete-bill/id=:id", patientController.deleteBill);
router.post("/pay-bill/id=:id", patientController.payBill);

// Shared data from PaySys
router.get("/pay-logs", patientController.getPayLog);
router.get("/paysys-info", patientController.getAccountInfoPaySys);

module.exports = router;
