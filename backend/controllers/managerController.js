const Manager = require('../models/Manager');
const bcrypt = require('bcrypt');

// Manager Login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        // Find manager by username
        const manager = await Manager.findOne({ username });

        if (!manager) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // 🔒 Compare hashed password
        const isMatch = await bcrypt.compare(password, manager.passwordHash);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Login successful
        res.json({
            success: true,
            message: 'Login successful',
            manager: {
                id: manager._id,
                username: manager.username,
                role: 'manager'
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
