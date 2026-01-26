const SeatMaintenance = require('../models/SeatMaintenance');

// Get all seats under maintenance
exports.getMaintenanceSeats = async (req, res) => {
  try {
    const maintenanceSeats = await SeatMaintenance.find({ isActive: true });
    res.json({ 
      success: true, 
      maintenanceSeats: maintenanceSeats.map(m => m.seatId) 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all maintenance records (for manager view)
exports.getAllMaintenanceRecords = async (req, res) => {
  try {
    const records = await SeatMaintenance.find().sort({ createdAt: -1 });
    res.json({ success: true, records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark seat as under maintenance
exports.markSeatMaintenance = async (req, res) => {
  try {
    const { seatId, reason, markedBy, endDate } = req.body;

    if (!seatId || !markedBy) {
      return res.status(400).json({ 
        success: false, 
        message: 'Seat ID and manager email are required' 
      });
    }

    // Check if already under maintenance
    const existing = await SeatMaintenance.findOne({ seatId, isActive: true });
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: 'Seat is already under maintenance' 
      });
    }

    const maintenance = new SeatMaintenance({
      seatId,
      reason: reason || 'Furniture issue',
      markedBy,
      endDate: endDate || null
    });

    await maintenance.save();
    res.status(201).json({ success: true, maintenance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove seat from maintenance
exports.removeSeatMaintenance = async (req, res) => {
  try {
    const { id } = req.params;

    const maintenance = await SeatMaintenance.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!maintenance) {
      return res.status(404).json({ 
        success: false, 
        message: 'Maintenance record not found' 
      });
    }

    res.json({ success: true, message: 'Seat removed from maintenance' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Bulk remove multiple seats from maintenance
exports.bulkRemoveMaintenance = async (req, res) => {
  try {
    const { seatIds } = req.body;

    await SeatMaintenance.updateMany(
      { seatId: { $in: seatIds }, isActive: true },
      { isActive: false }
    );

    res.json({ success: true, message: 'Seats removed from maintenance' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};