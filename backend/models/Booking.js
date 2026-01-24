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
    required: true
    // Format: "HH:MM-HH:MM"
  },

  // exact start datetime for automation
  bookingDateTime: {
    type: Date,
    required: true
  },

  numberOfSeats: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },

  selectedSeats: {
    type: [String], // Array of strings like ["1-T1-S1", "1-T1-S2"]
    default: []
  },

  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },

  // automation flags
  reminderSent: {
    type: Boolean,
    default: false
  },

  timeAlertSent: {
    type: Boolean,
    default: false
  },

  arrivalConfirmed: {
    type: Boolean,
    default: null
  },
  notificationPreference: {
  type: String,
  enum: ['sms', 'email', 'both'],
  default: 'both'
},

  specialRequests: {
    type: String,
    default: ''
  }

}, {
  timestamps: true
});

// Indexes
bookingSchema.index({ bookingDateTime: 1 });
bookingSchema.index({ customerEmail: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
