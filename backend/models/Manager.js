const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    passwordHash: {
        type: String, // In a real app, this should be hashed
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Manager', managerSchema);
