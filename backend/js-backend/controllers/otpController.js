const OTP = require('../models/Otp');

let currentOtp = null;
let otpTimer = null;
const trainerId = "11111111-aaaa-4aaa-bbbb-aaaaaaaaaaaa"; // Default trainer ID

// Generate a new random OTP
const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000);
};

// Store OTP in database for IVR system
const storeOtpInDatabase = async (otp) => {
    try {
        const expiresAt = new Date(Date.now() + 10000); // Expires in 10 seconds

        // Mark previous OTPs as expired
        await OTP.markExpiredOtps();

        // Create new OTP record
        await OTP.create({
            otp: otp,
            trainer_id: trainerId,
            trainee_id: null, // Will be set when trainee uses it
            status: 'pending',
            expires_at: expiresAt.toISOString()
        });

        console.log(`New OTP ${otp} stored in database for IVR system`);
    } catch (error) {
        console.error('Error storing OTP in database:', error);
    }
};

// Initialize OTP generation with database storage
const initializeOtp = () => {
    currentOtp = generateOtp();
    storeOtpInDatabase(currentOtp);

    // Generate new OTP every 10 seconds and store in database
    otpTimer = setInterval(async () => {
        currentOtp = generateOtp();
        console.log('New OTP generated for IVR:', currentOtp);
        await storeOtpInDatabase(currentOtp);
    }, 10000);
};

// Start OTP generation when server starts
initializeOtp();

// Get current OTP (for trainer dashboard)
exports.getCurrentOtp = (req, res) => {
    try {
        res.json({
            otp: currentOtp,
            timestamp: new Date().toISOString(),
            message: "Current OTP for attendance verification"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Verify OTP from trainee (IVR-like functionality)
exports.verifyOtp = async (req, res) => {
    try {
        const { otp, trainee_id, trainee_name } = req.body;

        if (!otp || !trainee_id) {
            return res.status(400).json({ error: 'OTP and trainee_id are required' });
        }

        // Verify OTP against database
        const result = await OTP.verify(otp, trainee_id);

        if (result.success) {
            res.json({
                success: true,
                message: `Attendance marked for ${trainee_name || 'trainee'}`,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get OTP statistics (for admin/trainer)
exports.getOtpStats = async (req, res) => {
    try {
        const stats = await OTP.getStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all OTP records (for admin)
exports.getAllOtps = async (req, res) => {
    try {
        const otps = await OTP.getAll();
        res.json(otps);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Simulate IVR call endpoint (dummy endpoint for demo)
exports.simulateIvrCall = async (req, res) => {
    try {
        const { phone_number, trainee_name } = req.body;

        // Simulate IVR call delay
        setTimeout(() => {
            console.log(`📞 IVR Call simulation: Called ${phone_number} for ${trainee_name}`);
            console.log(`🤖 IVR Message: "Please enter the 4-digit OTP shown on your trainer's screen to mark attendance"`);
        }, 1000);

        res.json({
            success: true,
            message: `IVR call initiated to ${phone_number}`,
            instruction: "Trainee will receive call asking for OTP",
            current_otp: currentOtp // For demo purposes
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get OTP with SSE (Server-Sent Events) for real-time updates
exports.getOtpStream = (req, res) => {
    try {
        // Set headers for SSE
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Cache-Control'
        });

        // Send current OTP immediately
        res.write(`data: ${JSON.stringify({ otp: currentOtp, timestamp: new Date().toISOString() })}\n\n`);

        // Send new OTP every 10 seconds
        const streamInterval = setInterval(() => {
            res.write(`data: ${JSON.stringify({ otp: currentOtp, timestamp: new Date().toISOString() })}\n\n`);
        }, 10000);

        // Clean up on client disconnect
        req.on('close', () => {
            clearInterval(streamInterval);
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get OTPs by trainee ID for attendance tracking
exports.getOtpsByTrainee = async (req, res) => {
    try {
        const { traineeId } = req.params;
        const otps = await OTP.getByTraineeId(traineeId);
        res.json(otps);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
