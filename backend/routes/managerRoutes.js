const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');

// Manager Login
router.post('/login', managerController.login);

module.exports = router;
