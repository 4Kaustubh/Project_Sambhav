// Get all trainees
exports.getAllTrainees = async (req, res) => {
    try {
        const trainees = await Trainee.getAll();
        res.json(trainees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const Trainee = require('../models/Trainee');

// Create a new trainee (for Data Collector dashboard)
exports.createTrainee = async (req, res) => {
    try {
        const errors = Trainee.validateTraineeData(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        const trainee = await Trainee.create(req.body);
        res.status(201).json({ message: 'Trainee created successfully', trainee });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
