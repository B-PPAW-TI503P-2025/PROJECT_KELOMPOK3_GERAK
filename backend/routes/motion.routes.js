const express = require('express');
const router = express.Router();
const controller = require('../controllers/motion.controller');

// Endpoint Baru untuk Status Monitoring
router.get('/status', controller.getSystemStatus);    // User & Admin pakai ini
router.post('/status', controller.updateSystemStatus); // Hanya Admin pakai ini

// POST data dari ESP32 / Postman
router.post('/', controller.addMotion);

// GET untuk WEB
router.get('/latest', controller.getLatestMotion);
router.get('/', controller.getAllMotion);
router.get('/stats/hourly', controller.getHourlyStats);

module.exports = router;