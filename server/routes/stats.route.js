const router = require("express").Router();
const statsController = require("../controllers/stats.controller");

// Status related
router.get("/status", statsController.getStatusStats);
router.get("/packages", statsController.getPackageStats);
router.get("/products", statsController.getProductStats);

module.exports = router;