const router = require("express").Router();
const controller = require("../controllers/auth.controller");

// API
router.post("/check", controller.checkHasLoggedIn);
router.post("/login", controller.login);

module.exports = router;
