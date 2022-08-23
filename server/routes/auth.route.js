const router = require("express").Router();
const controller = require("../controllers/auth.controller");

router.post("/check", controller.checkHasLoggedIn);
router.post("/login", controller.login);
router.post("/update-password", controller.updatePassword);

// Route to call from PaySys to check if the account requesting is valid
router.post('/is-valid-account', controller.checkValidAccount);

// Route to init admin on startup
router.post('/init', controller.initCheck);
router.post('/init-admin', controller.initAdmin);

module.exports = router;
