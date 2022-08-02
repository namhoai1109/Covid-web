const router = require("express").Router();
const facilityController = require("../controllers/facility.controller");

// API 
router.post("/create", facilityController.createFacility);
router.put("/update/id=:id", facilityController.updateFacility);
router.get("/provinces", facilityController.getProvinces);

module.exports = router;