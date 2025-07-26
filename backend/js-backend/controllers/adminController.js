const Company = require('../models/Company');
const Placement = require('../models/Placement');

// Fetch all companies
exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.getAll();
        res.json(companies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch company by ID
exports.getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) return res.status(404).json({ error: 'Company not found' });
        res.json(company);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch all placements
exports.getAllPlacements = async (req, res) => {
    try {
        const placements = await Placement.getAll();
        res.json(placements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch placement by ID
exports.getPlacementById = async (req, res) => {
    try {
        const placement = await Placement.findById(req.params.id);
        if (!placement) return res.status(404).json({ error: 'Placement not found' });
        res.json(placement);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
