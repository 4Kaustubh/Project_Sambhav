const Evaluation = require('../models/Evaluation');

// Create a new evaluation
exports.createEvaluation = async (req, res) => {
    try {
        const errors = Evaluation.validateEvaluationData(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const evaluation = await Evaluation.create(req.body);
        res.status(201).json({ message: 'Evaluation created successfully', evaluation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all evaluations
exports.getAllEvaluations = async (req, res) => {
    try {
        const evaluations = await Evaluation.getAll();
        res.json(evaluations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get evaluation by ID
exports.getEvaluationById = async (req, res) => {
    try {
        const evaluation = await Evaluation.findById(req.params.id);
        if (!evaluation) return res.status(404).json({ error: 'Evaluation not found' });
        res.json(evaluation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get evaluations by trainee ID
exports.getEvaluationsByTraineeId = async (req, res) => {
    try {
        const evaluations = await Evaluation.getByTraineeId(req.params.traineeId);
        res.json(evaluations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get evaluations by trainer ID
exports.getEvaluationsByTrainerId = async (req, res) => {
    try {
        const evaluations = await Evaluation.getByTrainerId(req.params.trainerId);
        res.json(evaluations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update evaluation
exports.updateEvaluation = async (req, res) => {
    try {
        const errors = Evaluation.validateEvaluationData(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const evaluation = await Evaluation.update(req.params.id, req.body);
        if (!evaluation) return res.status(404).json({ error: 'Evaluation not found' });
        res.json({ message: 'Evaluation updated successfully', evaluation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete evaluation
exports.deleteEvaluation = async (req, res) => {
    try {
        await Evaluation.delete(req.params.id);
        res.json({ message: 'Evaluation deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get evaluations with trainee details
exports.getEvaluationsWithTraineeDetails = async (req, res) => {
    try {
        const evaluations = await Evaluation.getWithTraineeDetails();
        res.json(evaluations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
