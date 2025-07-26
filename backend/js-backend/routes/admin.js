
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Only GET routes for admin
router.get('/companies', adminController.getAllCompanies);
router.get('/companies/:id', adminController.getCompanyById);
router.get('/placements', adminController.getAllPlacements);
router.get('/placements/:id', adminController.getPlacementById);


module.exports = router;
