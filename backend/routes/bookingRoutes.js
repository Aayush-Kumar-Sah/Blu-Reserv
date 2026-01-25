const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Get all bookings
/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management
 */

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: List of all bookings
 */
router.get('/', bookingController.getAllBookings);

// Check availability
/**
 * @swagger
 * /api/bookings/availability:
 *   get:
 *     summary: Check table availability
 *     tags: [Bookings]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         required: true
 *         description: Date to check (YYYY-MM-DD)
 *       - in: query
 *         name: time
 *         schema:
 *           type: string
 *         required: true
 *         description: Time to check (HH:mm)
 *       - in: query
 *         name: guests
 *         schema:
 *           type: integer
 *         required: true
 *         description: Number of guests
 *     responses:
 *       200:
 *         description: Availability status
 */
router.get('/availability', bookingController.checkAvailability);

/**
 * @swagger
 * /api/bookings/occupied:
 *   get:
 *     summary: Get occupied seats
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: List of occupied seats
 */
router.get('/occupied', bookingController.getOccupiedSeats);

// Get bookings by date
/**
 * @swagger
 * /api/bookings/date/{date}:
 *   get:
 *     summary: Get bookings by date
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: date
 *         schema:
 *           type: string
 *         required: true
 *         description: Date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of bookings for the date
 */
router.get('/date/:date', bookingController.getBookingsByDate);

// Get booking by ID
/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking details
 *       404:
 *         description: Booking not found
 */
router.get('/:id', bookingController.getBookingById);

// Create new booking
/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - time
 *               - guests
 *               - name
 *               - email
 *               - phone
 *             properties:
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *               guests:
 *                 type: integer
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created
 */
router.post('/', bookingController.createBooking);

// Update booking
/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     summary: Update a booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *               guests:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Booking updated
 */
router.put('/:id', bookingController.updateBooking);

// Cancel booking
/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   patch:
 *     summary: Cancel a booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking cancelled
 */
router.patch('/:id/cancel', bookingController.cancelBooking);

//Confirmation 
/**
 * @swagger
 * /api/bookings/{id}/arrival-yes:
 *   patch:
 *     summary: Confirm arrival
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Arrival confirmed
 */
router.patch('/:id/arrival-yes', bookingController.confirmArrivalYes);

/**
 * @swagger
 * /api/bookings/{id}/arrival-no:
 *   patch:
 *     summary: Confirm no-show
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: No-show confirmed
 */
router.patch('/:id/arrival-no', bookingController.confirmArrivalNo);

// Delete booking
/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Delete a booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking deleted
 */
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
