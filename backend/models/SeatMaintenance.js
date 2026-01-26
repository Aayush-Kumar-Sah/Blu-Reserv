const mongoose = require('mongoose');

const seatMaintenanceSchema = new mongoose.Schema({
  seatId: {
    type: String,
    required: true,
    // Format: "1-T1-S1" (Floor-Table-Seat)
  },
  reason: {
    type: String,
    default: 'Furniture issue'
  },
  markedBy: {
    type: String, // Manager email
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date, 
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

seatMaintenanceSchema.index({ seatId: 1, isActive: 1 });

module.exports = mongoose.model('SeatMaintenance', seatMaintenanceSchema);