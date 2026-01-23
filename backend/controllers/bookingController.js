const Booking = require('../models/Booking');
const Restaurant = require('../models/Restaurant');

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ bookingDate: 1, timeSlot: 1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.confirmArrivalYes = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        arrivalConfirmed: true,
        status: 'confirmed'
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({ success: true, booking });

  } catch (error) {
    // invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.confirmArrivalNo = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        arrivalConfirmed: false,
        status: 'cancelled'
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({ success: true, booking });

  } catch (error) {
    // invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }

    // other server errors
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Check available seats for a time slot
exports.checkAvailability = async (req, res) => {
  try {
    const { date, timeSlot } = req.query;
    
    if (!date || !timeSlot) {
      return res.status(400).json({ 
        success: false, 
        message: 'Date and timeSlot are required' 
      });
    }

    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    // Get restaurant settings
    const restaurant = await Restaurant.findOne();
    const totalSeats = restaurant ? restaurant.totalSeats : 50;

    // Get confirmed bookings for this slot
    const bookings = await Booking.find({
      bookingDate,
      timeSlot,
      status: 'confirmed'
    });

    const bookedSeats = bookings.reduce((sum, booking) => sum + booking.numberOfSeats, 0);
    const availableSeats = totalSeats - bookedSeats;

    res.json({ 
      success: true, 
      availableSeats,
      totalSeats,
      bookedSeats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new booking
exports.createBooking = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      bookingDate,
      timeSlot,
      numberOfSeats,
      specialRequests
    } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !bookingDate || !timeSlot || !numberOfSeats) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

   //  validate timeSlot format: "HH:MM-HH:MM" (24-hour format)
const timeSlotPattern = /^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/;

if (!timeSlotPattern.test(timeSlot)) {
  return res.status(400).json({
    success: false,
    message: 'Invalid timeSlot format. Expected HH:MM-HH:MM'
  });
}

// normalize date
// bookingDate is like: "2026-01-22"
const baseDate = new Date(bookingDate + "T00:00:00"); // local date, not UTC

const startTime = timeSlot.split('-')[0]; // "18:00"
const [hh, mm] = startTime.split(':');

// create local datetime
const bookingDateTime = new Date(
  baseDate.getFullYear(),
  baseDate.getMonth(),
  baseDate.getDate(),
  Number(hh),
  Number(mm),
  0,
  0
);



    // seat logic
    const restaurant = await Restaurant.findOne();
    const totalSeats = restaurant ? restaurant.totalSeats : 50;

    const existingBookings = await Booking.find({
      bookingDate: baseDate,
      timeSlot,
      status: 'confirmed'
    });

    const bookedSeats = existingBookings.reduce((sum, b) => sum + b.numberOfSeats, 0);
    const availableSeats = totalSeats - bookedSeats;

    if (numberOfSeats > availableSeats) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableSeats} seats available`
      });
    }

    // create booking with bookingDateTime
    const booking = new Booking({
      customerName,
      customerEmail,
      customerPhone,
      bookingDate: baseDate,
      timeSlot,
      bookingDateTime,  
      numberOfSeats,
      specialRequests: specialRequests || '',
      reminderSent: false,
      timeAlertSent: false,
      arrivalConfirmed: null
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });

  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update booking
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // If changing date/time/seats, check availability
    if (updates.bookingDate || updates.timeSlot || updates.numberOfSeats) {
      const date = updates.bookingDate ? new Date(updates.bookingDate) : booking.bookingDate;
      date.setHours(0, 0, 0, 0);
      const slot = updates.timeSlot || booking.timeSlot;
      const seats = updates.numberOfSeats || booking.numberOfSeats;

      const restaurant = await Restaurant.findOne();
      const totalSeats = restaurant ? restaurant.totalSeats : 50;

      const existingBookings = await Booking.find({
        _id: { $ne: id },
        bookingDate: date,
        timeSlot: slot,
        status: 'confirmed'
      });

      const bookedSeats = existingBookings.reduce((sum, b) => sum + b.numberOfSeats, 0);
      const availableSeats = totalSeats - bookedSeats;

      if (seats > availableSeats) {
        return res.status(400).json({ 
          success: false, 
          message: `Only ${availableSeats} seats available for this time slot` 
        });
      }
    }

    const updatedBooking = await Booking.findByIdAndUpdate(id, updates, { new: true });

    res.json({ 
      success: true, 
      message: 'Booking updated successfully',
      booking: updatedBooking 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ 
      success: true, 
      message: 'Booking cancelled successfully',
      booking 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ 
      success: true, 
      message: 'Booking deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get bookings by date
exports.getBookingsByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    const bookings = await Booking.find({ 
      bookingDate,
      status: { $ne: 'cancelled' }
    }).sort({ timeSlot: 1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
