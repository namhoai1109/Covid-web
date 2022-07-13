const router = require('express').Router();
const controller = require('../controllers/admin.controller');

// API
router.post('/register', controller.registerAccount);
router.get('/info', controller.getAll);
router.get('/admin_info', controller.getAdminInfo);

module.exports = router;
