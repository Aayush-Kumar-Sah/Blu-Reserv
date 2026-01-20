const Restaurant = require('../models/Restaurant');

// Get restaurant settings
exports.getRestaurant = async (req, res) => {
  try {
    let restaurant = await Restaurant.findOne();
    
    // Create default if doesn't exist
    if (!restaurant) {
      restaurant = new Restaurant({
        name: 'My Restaurant',
        totalSeats: 50,
        openingTime: '10:00',
        closingTime: '22:00',
        slotDuration: 60,
        description: 'Welcome to our restaurant'
      });
      await restaurant.save();
    }

    res.json({ success: true, restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update restaurant settings
exports.updateRestaurant = async (req, res) => {
  try {
    let restaurant = await Restaurant.findOne();
    
    if (!restaurant) {
      restaurant = new Restaurant(req.body);
    } else {
      Object.assign(restaurant, req.body);
    }
    
    await restaurant.save();

    res.json({ 
      success: true, 
      message: 'Restaurant settings updated successfully',
      restaurant 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Generate time slots
exports.getTimeSlots = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne();
    
    if (!restaurant) {
      return res.status(404).json({ 
        success: false, 
        message: 'Restaurant settings not found' 
      });
    }

    const slots = generateTimeSlots(
      restaurant.openingTime, 
      restaurant.closingTime, 
      restaurant.slotDuration
    );

    res.json({ success: true, timeSlots: slots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function to generate time slots
function generateTimeSlots(openingTime, closingTime, duration) {
  const slots = [];
  const [openHour, openMin] = openingTime.split(':').map(Number);
  const [closeHour, closeMin] = closingTime.split(':').map(Number);

  let currentHour = openHour;
  let currentMin = openMin;

  while (currentHour < closeHour || (currentHour === closeHour && currentMin < closeMin)) {
    const startTime = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
    
    // Calculate end time
    let endMin = currentMin + duration;
    let endHour = currentHour;
    
    if (endMin >= 60) {
      endHour += Math.floor(endMin / 60);
      endMin = endMin % 60;
    }

    const endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;
    
    // Only add slot if end time is within closing time
    if (endHour < closeHour || (endHour === closeHour && endMin <= closeMin)) {
      slots.push(`${startTime}-${endTime}`);
    }

    // Move to next slot
    currentMin += duration;
    if (currentMin >= 60) {
      currentHour += Math.floor(currentMin / 60);
      currentMin = currentMin % 60;
    }
  }

  return slots;
}

module.exports = exports;
