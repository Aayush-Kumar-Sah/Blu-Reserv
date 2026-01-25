const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

// Get restaurant settings
/**
 * @swagger
 * tags:
 *   name: Restaurant
 *   description: Restaurant settings and details
 */

/**
 * @swagger
 * /api/restaurant:
 *   get:
 *     summary: Get restaurant details
 *     tags: [Restaurant]
 *     responses:
 *       200:
 *         description: Restaurant details
 */
router.get('/', restaurantController.getRestaurant);

// Update restaurant settings
/**
 * @swagger
 * /api/restaurant:
 *   put:
 *     summary: Update restaurant settings
 *     tags: [Restaurant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Restaurant updated
 */
router.put('/', restaurantController.updateRestaurant);

// Get available time slots
/**
 * @swagger
 * /api/restaurant/timeslots:
 *   get:
 *     summary: Get available time slots
 *     tags: [Restaurant]
 *     responses:
 *       200:
 *         description: List of time slots
 */
router.get('/timeslots', restaurantController.getTimeSlots);

module.exports = router;
