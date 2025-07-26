const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');

// POST /api/evaluations - create a new evaluation
router.post('/', evaluationController.createEvaluation);

// GET /api/evaluations - get all evaluations
router.get('/', evaluationController.getAllEvaluations);

// GET /api/evaluations/:id - get evaluation by ID
router.get('/:id', evaluationController.getEvaluationById);

// GET /api/evaluations/trainee/:traineeId - get evaluations by trainee ID
router.get('/trainee/:traineeId', evaluationController.getEvaluationsByTraineeId);

// GET /api/evaluations/trainer/:trainerId - get evaluations by trainer ID
router.get('/trainer/:trainerId', evaluationController.getEvaluationsByTrainerId);

// GET /api/evaluations/details/all - get evaluations with trainee details
router.get('/details/all', evaluationController.getEvaluationsWithTraineeDetails);

// PUT /api/evaluations/:id - update evaluation
router.put('/:id', evaluationController.updateEvaluation);

// DELETE /api/evaluations/:id - delete evaluation
router.delete('/:id', evaluationController.deleteEvaluation);

module.exports = router;
