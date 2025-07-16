// app.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { subscribedDB, registeredDB } = require('./db/db');
const setupRoutes = require('./routes/mainRoutes');

const adminMainRoutes = require('./routes/admin/adminMainRoute');

const roadmapRoute = require("./routes/roadmap/roadmap");




const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Bind all routes
setupRoutes(app, subscribedDB, registeredDB);
app.use('/api/admin', adminMainRoutes);

app.use("/api/roadmap", roadmapRoute);




app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
