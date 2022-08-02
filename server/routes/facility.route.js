const router = require("express").Router();
const facilityController = require("../controllers/facility.controller");

// API 
router.post("/create", facilityController.createFacility);
router.put("/update/id=:id", facilityController.updateFacility);
<<<<<<< HEAD
<<<<<<< HEAD
router.get("/provinces", facilityController.getProvinces);
=======
=======
>>>>>>> main
router.get("/get/id=:id", facilityController.readFacilityOne);
router.get("/get/all", facilityController.readFacilityAll);
router.delete("/delete/id=:id", facilityController.deleteFacilityOne);
router.delete("/delete/all", facilityController.deleteFacilityAll);
<<<<<<< HEAD
>>>>>>> main
=======
>>>>>>> main

module.exports = router;