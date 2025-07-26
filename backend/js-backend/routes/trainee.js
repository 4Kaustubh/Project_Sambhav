const express = require('express');
const router = express.Router();
const traineeController = require('../controllers/traineeController');


// POST /api/trainees - create a new trainee
router.post('/', traineeController.createTrainee);

// GET /api/trainees - fetch all trainees
router.get('/', traineeController.getAllTrainees);

module.exports = router;
