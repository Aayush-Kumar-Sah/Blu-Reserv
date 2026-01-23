const mongoose = require('mongoose');

const slotLockSchema = new mongoose.Schema({
  bookingDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  userToken: {
    type: String, // browser/session id
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
});

// Auto delete after expiry
slotLockSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('SlotLock', slotLockSchema);
