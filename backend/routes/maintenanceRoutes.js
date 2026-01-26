const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');

/**
 * @swagger
 * tags:
 *   name: Maintenance
 *   description: Seat maintenance management
 */

/**
 * @swagger
 * /api/maintenance:
 *   get:
 *     summary: Get all active maintenance seats
 *     tags: [Maintenance]
 *     responses:
 *       200:
 *         description: List of seats under maintenance
 */
router.get('/', maintenanceController.getMaintenanceSeats);

/**
 * @swagger
 * /api/maintenance/records:
 *   get:
 *     summary: Get all maintenance records (Manager only)
 *     tags: [Maintenance]
 *     responses:
 *       200:
 *         description: All maintenance records
 */
router.get('/records', maintenanceController.getAllMaintenanceRecords);

/**
 * @swagger
 * /api/maintenance:
 *   post:
 *     summary: Mark seat as under maintenance
 *     tags: [Maintenance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seatId:
 *                 type: string
 *               reason:
 *                 type: string
 *               markedBy:
 *                 type: string
 *     responses:
 *       201:
 *         description: Seat marked for maintenance
 */
router.post('/', maintenanceController.markSeatMaintenance);

/**
 * @swagger
 * /api/maintenance/{id}:
 *   delete:
 *     summary: Remove seat from maintenance
 *     tags: [Maintenance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Seat removed from maintenance
 */
router.delete('/:id', maintenanceController.removeSeatMaintenance);

/**
 * @swagger
 * /api/maintenance/bulk:
 *   post:
 *     summary: Bulk remove seats from maintenance
 *     tags: [Maintenance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seatIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Seats removed from maintenance
 */
router.post('/bulk', maintenanceController.bulkRemoveMaintenance);

module.exports = router;