const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true
  },
  bookingDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true,
    // Format: "HH:MM-HH:MM" e.g., "12:00-13:00"
  },
  numberOfSeats: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  specialRequests: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for efficient queries
bookingSchema.index({ bookingDate: 1, timeSlot: 1 });
bookingSchema.index({ customerEmail: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
