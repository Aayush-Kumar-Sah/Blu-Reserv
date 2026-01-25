const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');

// Manager Login
/**
 * @swagger
 * tags:
 *   name: Manager
 *   description: Manager access
 */

/**
 * @swagger
 * /api/manager/login:
 *   post:
 *     summary: Manager login
 *     tags: [Manager]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
router.post('/login', managerController.login);

module.exports = router;
