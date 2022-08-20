const router = require("express").Router();
const controller = require('../controllers/main.controller');
const { authorizeUser } = require('../middlewares/auth');

// TODO: Implement JWT authentication
router.get('/info', authorizeUser(), controller.getAccountInfo);
router.post('/deposit', authorizeUser(), controller.makeDeposit);
router.post('/pay', controller.makePayment);
router.put('/password', authorizeUser(), controller.changePassword);
router.post('/register', controller.registerAccount);

module.exports = router;