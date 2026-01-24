const mongoose = require('mongoose');
const Manager = require('./models/Manager');
require('dotenv').config();

const PASSWORD_HASH = '$2b$10$l1JLBlfwqe4a79Hi5KT9F.OwkTV3PmtQ0yoKjNBISRpuam7AU4ydC';

async function seedManager() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await Manager.findOneAndUpdate(
            { username: 'admin' },
            {
                username: 'admin',
                passwordHash: PASSWORD_HASH
            },
            {
                upsert: true,
                new: true
            }
        );

        console.log('Default manager ensured with hashed password (admin / password123)');
        process.exit(0);

    } catch (err) {
        console.error('Error seeding manager:', err);
        process.exit(1);
    }
}

seedManager();
