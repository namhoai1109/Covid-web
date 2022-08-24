const router = require("express").Router();
const patientController = require("../controllers/doctor.controller");
const productController = require("../controllers/product.controller");
const packageController = require("../controllers/package.controller");
const facilityController = require("../controllers/facility.controller");
const { uploadFile } = require("../middlewares/multer");

// Info related
router.put("/password", patientController.changePassword);

// Patients related
router.get("/patients", patientController.getAllPatients);
router.get("/patients/search", patientController.searchPatients);
router.get("/patients/filter", patientController.filterPatients);
router.post("/patients", patientController.registerAccount);
router.put("/patients/id=:id", patientController.updatePatient);
router.delete("/patients/id=:id", patientController.deletePatient);
router.get("/patients/credit-limit", patientController.getCurrentCreditLimit);
router.put("/patients/credit-limit", patientController.updateCreditLimit);
router.get("/patients/with-ps-account", patientController.getPatientsWithPSAccount);
router.post("/patients/debt-notification", patientController.pushDebtNotification);
router.post("/patients/debt-notification-all", patientController.pushDebtNotificationAll);

// Necessities related
router.get("/products", productController.getAllProducts);
router.get("/products/search", productController.searchProducts);
router.get("/products/filter", productController.filterProducts);
router.post("/products", uploadFile("images", "array", 5), productController.registerProduct);
router.put("/products/id=:id", uploadFile("images", "array", 5), productController.updateProduct);
router.delete("/products/id=:id", productController.deleteProduct);

// Packages related
router.get("/packages", packageController.getAllPackages);
router.get("/packages/search", packageController.searchPackages);
router.get("/packages/filter", packageController.filterPackages);
router.post("/packages", packageController.registerPackage);
router.put("/packages/id=:id", packageController.updatePackage);
router.delete("/packages/id=:id", packageController.deletePackage);

// Facilities related
router.get("/facilities", facilityController.readFacilityAll);
router.get("/facilities/id=:id", facilityController.readFacilityOne);
router.get("/facilities/provinces", facilityController.getProvinces);


module.exports = router;