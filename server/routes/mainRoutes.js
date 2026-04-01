
const courseRoute = require('./course');                 // Course enrollments
const sendComparisonImage = require('./sendComparisonImage'); // Email image sending
const roadmapRoute = require('./roadmap/roadmap');       // Roadmap generation

module.exports = function mainRoutes(app) {
  app.use('/api', courseRoute);               // /api/course
  app.use('/api/send-comparison-image', sendComparisonImage); 
  app.use('/api/roadmap', roadmapRoute);     // /api/roadmap
};
