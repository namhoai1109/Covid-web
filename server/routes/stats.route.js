const router = require("express").Router();
const statsController = require("../controllers/stats.controller");

// Status related
router.get("/status", statsController.getStatusStats);

module.exports = router;