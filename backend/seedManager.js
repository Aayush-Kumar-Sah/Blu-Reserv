const mongoose = require('mongoose');
const Manager = require('./models/Manager');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant-booking')
    .then(async () => {
        console.log('Connected to MongoDB');

        // Check if manager exists
        const existingManager = await Manager.findOne({ username: 'admin' });
        if (existingManager) {
            console.log('Default manager already exists');
        } else {
            await Manager.create({
                username: 'admin',
                password: 'password123'
            });
            console.log('Default manager created: admin / password123');
        }

        process.exit(0);
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
        process.exit(1);
    });
