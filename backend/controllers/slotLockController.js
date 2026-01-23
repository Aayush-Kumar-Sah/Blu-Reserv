const SlotLock = require('../models/SlotLock');

exports.lockSlot = async (req, res) => {
  try {
    const { bookingDate, timeSlot, userToken } = req.body;

    // check if already locked
    const existingLock = await SlotLock.findOne({ bookingDate, timeSlot });

    if (existingLock) {
      return res.status(409).json({
        success: false,
        message: 'Slot temporarily locked by another user'
      });
    }

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const lock = new SlotLock({
      bookingDate,
      timeSlot,
      userToken,
      expiresAt
    });

    await lock.save();

    res.json({ success: true, message: 'Slot locked for 5 minutes' });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.releaseSlot = async (req, res) => {
  const { bookingDate, timeSlot, userToken } = req.body;

  await SlotLock.deleteOne({ bookingDate, timeSlot, userToken });

  res.json({ success: true });
};
