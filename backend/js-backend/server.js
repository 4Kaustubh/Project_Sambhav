// backend/index.js
const express = require("express");

const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const apiRoutes = require("./routes/api");
const placementOfficerRoutes = require("./routes/placement_officer");

const app = express();

require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Routes
const adminRoutes = require('./routes/admin');
const traineeRoutes = require('./routes/trainee');
const evaluationRoutes = require('./routes/evaluation');
const otpRoutes = require('./routes/otp');
app.use('/api/admin', adminRoutes);
app.use('/api/trainees', traineeRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/otp', otpRoutes);
//Routes
app.use("/api", apiRoutes);
app.use("/placement-officer", placementOfficerRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
