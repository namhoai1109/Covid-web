const router = require("express").Router();
const facilityController = require("../controllers/facility.controller");

// API 
router.post("/create", facilityController.createFacility);


module.exports = router;