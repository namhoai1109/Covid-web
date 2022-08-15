const router = require("express").Router();
const controller = require("../controllers/admin.controller");

// API
router.post("/register", controller.registerAccount);
router.get("/doctors", controller.getAll);
router.put("/doctors/id=:id/changestatus", controller.changeStatus);
router.delete("/doctors/id=:id/delete", controller.deleteAccount);
router.get("/doctors/id=:id/logs", controller.getLogs);
// router.get("/admin", controller.getAdminInfo);


module.exports = router;