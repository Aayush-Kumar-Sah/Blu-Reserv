const Manager = require('../models/Manager');

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

        // Check password (direct comparison for now as requested)
        if (manager.password !== password) {
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
                username: manager.username
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
