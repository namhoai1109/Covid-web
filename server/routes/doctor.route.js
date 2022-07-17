const router = require("express").Router();
const patientController = require("../controllers/patient.controller");
const productController = require("../controllers/product.controller");
const { uploadFile } = require('../middlewares/multer');

// Patients related
router.get("/patients", patientController.getAllPatients);
router.post("/patients", patientController.registerAccount);
router.put("/patients/id=:id", patientController.updatePatient);
router.delete("/patients/id=:id", patientController.deletePatient);

// Necessities related
router.get("/products", productController.getAllProducts);
router.post("/products", uploadFile('images', 'array', 5), productController.registerProduct);
router.put("/products/id=:id", uploadFile('images', 'array', 5), productController.updateProduct);
router.delete("/products/id=:id", productController.deleteProduct);

module.exports = router;
