const router = require("express").Router();
const controller = require('../controllers/main.controller');

router.get('/info/id=:id', controller.getAccountInfo);
router.post('/deposit/id=:id', controller.makeDeposit);
router.post('/pay/id=:id', controller.makePayment);
router.post('/password/id=:id', controller.changePassword);
router.post('/register', controller.registerAccount);

module.exports = router;