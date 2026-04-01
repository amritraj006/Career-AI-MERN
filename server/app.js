require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const connectDB = require('./config/db');          // MongoDB connection
const setupRoutes = require('./routes/mainRoutes'); // All API routes
const roadmapRoute = require("./routes/roadmap/roadmap");
const chatbotRoutes = require("./routes/chatbot");

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.json());

// Health check for Render
app.get('/', (req, res) => {
  res.send({ status: "Server is running ✅" });
});

// API Routes
setupRoutes(app);                    // /api/... routes
app.use("/api/roadmap", roadmapRoute);
app.use("/api/chatbot", chatbotRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
