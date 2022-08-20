const router = require("express").Router();
const controller = require('../controllers/main.controller');

// TODO: Implement JWT authentication

router.get('/info/id=:id', controller.getAccountInfo);
router.post('/deposit/id=:id', controller.makeDeposit);
router.post('/pay', controller.makePayment);
router.post('/password/id=:id', controller.changePassword);
router.post('/register', controller.registerAccount);

module.exports = router;