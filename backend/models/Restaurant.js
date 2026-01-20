const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'My Restaurant'
  },
  totalSeats: {
    type: Number,
    required: true,
    default: 50
  },
  openingTime: {
    type: String,
    required: true,
    default: '10:00'
  },
  closingTime: {
    type: String,
    required: true,
    default: '22:00'
  },
  slotDuration: {
    type: Number,
    required: true,
    default: 60 // in minutes
  },
  description: {
    type: String,
    default: 'Welcome to our restaurant'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
