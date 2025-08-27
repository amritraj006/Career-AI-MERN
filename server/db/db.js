const mysql = require("mysql2");
require("dotenv").config(); // Load environment variables

// Subscribed Users DB
const subscribedDB = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.SUBSCRIBED_DB_NAME,
});

// Registered Course DB
const registeredDB = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.REGISTERED_DB_NAME,
});

// Roadmap DB
const roadmapDB = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.ROADMAP_DB_NAME,
});

// Connect all DBs
subscribedDB.connect((err) => {
  if (err) console.error("❌ subscribed_users DB error:", err);
  else console.log("✅ Connected to subscribed_users DB.");
});

registeredDB.connect((err) => {
  if (err) console.error("❌ registered_course DB error:", err);
  else console.log("✅ Connected to registered_course DB.");
});

roadmapDB.connect((err) => {
  if (err) console.error("❌ roadmap DB error:", err);
  else console.log("✅ Connected to roadmap DB.");
});

module.exports = {
  subscribedDB,
  registeredDB,
  roadmapDB,
};
