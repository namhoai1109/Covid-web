const router = require("express").Router();
const controller = require("../controllers/admin.controller");

// API
router.post("/register", controller.registerAccount);
router.get("/doctors", controller.getAll);
// router.get("/admin", controller.getAdminInfo);


module.exports = router;
