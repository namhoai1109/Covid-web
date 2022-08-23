const router = require("express").Router();
const statsController = require("../controllers/stats.controller");

// Status related
router.get("/status", statsController.getStatusStats);
router.get("/packages", statsController.getPackageStats);
router.get("/products", statsController.getProductStats);
router.get("/recover-day", statsController.getRecoverDayStats);
router.get("/recover-all", statsController.getRecoverAllStats);
router.get("/income-log", statsController.getIncomeLog);

// // Income related
// router.get("/get-income-log", statsController.getIncomeExpenseLog);


module.exports = router;