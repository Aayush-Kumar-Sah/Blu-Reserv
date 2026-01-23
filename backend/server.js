require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

const bookingRoutes = require('./routes/bookingRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const managerRoutes = require('./routes/managerRoutes');
const app = express();

// Connect to MongoDB
connectDB();

require('./cron/bookingCron');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/manager', managerRoutes);

const { sendReminderEmail } = require('./services/emailService');



// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Restaurant Booking API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});



const PORT = process.env.PORT || 5555;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
