require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const connectDB = require('./config/db');          // MongoDB connection
const setupRoutes = require('./routes/mainRoutes'); // All API routes
const adminMainRoutes = require('./routes/admin/adminMainRoute');
const roadmapRoute = require("./routes/roadmap/roadmap");
const chatbotRoutes = require("./routes/chatbot");

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Health check for Render
app.get('/', (req, res) => {
  res.send({ status: "Server is running ✅" });
});

// API Routes
setupRoutes(app);                    // /api/... routes
app.use('/api/admin', adminMainRoutes);
app.use("/api/roadmap", roadmapRoute);
app.use("/api/chatbot", chatbotRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
