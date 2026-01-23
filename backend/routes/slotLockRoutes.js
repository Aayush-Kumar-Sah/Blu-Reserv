const express = require('express');
const router = express.Router();
const { lockSlot, releaseSlot } = require('../controllers/slotLockController');

router.post('/lock', lockSlot);
router.post('/release', releaseSlot);

module.exports = router;
