const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');

// GET /api/otp - get current OTP for trainer
router.get('/', otpController.getCurrentOtp);

// POST /api/otp/verify - verify OTP from trainee (IVR-like)
router.post('/verify', otpController.verifyOtp);

// GET /api/otp/stats - get OTP statistics
router.get('/stats', otpController.getOtpStats);

// GET /api/otp/all - get all OTP records (admin)
router.get('/all', otpController.getAllOtps);

// POST /api/otp/ivr-call - simulate IVR call (demo)
router.post('/ivr-call', otpController.simulateIvrCall);

// GET /api/otp/stream - get OTP stream (Server-Sent Events)
router.get('/stream', otpController.getOtpStream);

// GET /api/otp/trainee/:traineeId - get OTPs for specific trainee
router.get('/trainee/:traineeId', otpController.getOtpsByTrainee);

module.exports = router;
