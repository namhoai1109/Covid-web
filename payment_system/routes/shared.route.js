const router = require("express").Router();
const controller = require('../controllers/shared.controller');

router.get('/logs', controller.getPayLog);
router.post('/register', controller.registerAccount);
router.get('/info', controller.getAccountInfo);
router.get('/info-all', controller.getAccountsInfo);
// router.get('/income-log', controller.getIncomeLog);
module.exports = router;