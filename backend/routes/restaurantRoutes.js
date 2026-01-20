const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

// Get restaurant settings
router.get('/', restaurantController.getRestaurant);

// Update restaurant settings
router.put('/', restaurantController.updateRestaurant);

// Get available time slots
router.get('/timeslots', restaurantController.getTimeSlots);

module.exports = router;
