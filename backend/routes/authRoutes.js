const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication management
 */

/**
 * @swagger
 * /api/auth/callback:
 *   post:
 *     summary: OAuth callback handler
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 description: Authorization code from OAuth provider
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   description: User profile information
 *       500:
 *         description: Server error
 */
router.post('/callback', async (req, res) => {
  const { code } = req.body;

  try {
    const tokenRes = await axios.post(
      process.env.W3ID_TOKEN_URL,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'http://localhost:3000/callback',
        client_id: process.env.W3ID_CLIENT_ID,
        client_secret: process.env.W3ID_CLIENT_SECRET,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { id_token } = tokenRes.data;

    // Decode ID token (NO validation needed for intern project)
    const decoded = jwt.decode(id_token);

    /*
      decoded now contains:
      - emailAddress
      - firstName
      - lastName
      - uid (employee_id)
    */

    console.log('IBM User:', decoded.emailAddress);

    const User = require('../models/User');

    // Save or update user
    const user = await User.findOneAndUpdate(
      { email: decoded.email || decoded.emailAddress },
      {
        email: decoded.email || decoded.emailAddress,
        firstName: decoded.given_name || decoded.firstName,
        lastName: decoded.family_name || decoded.lastName,
        employeeId: decoded.employee_id || decoded.uid,
        role: 'user',
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      user: user,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false });
  }
});

module.exports = router;