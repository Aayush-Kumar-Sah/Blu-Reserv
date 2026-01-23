const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Get all bookings
router.get('/', bookingController.getAllBookings);

// Check availability
router.get('/availability', bookingController.checkAvailability);

// Get bookings by date
router.get('/date/:date', bookingController.getBookingsByDate);

// Get booking by ID
router.get('/:id', bookingController.getBookingById);

// Create new booking
router.post('/', bookingController.createBooking);

// Update booking
router.put('/:id', bookingController.updateBooking);

// Cancel booking
router.patch('/:id/cancel', bookingController.cancelBooking);

//Confirmation 
router.patch('/:id/arrival-yes', bookingController.confirmArrivalYes);
router.patch('/:id/arrival-no', bookingController.confirmArrivalNo);

// Delete booking
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
