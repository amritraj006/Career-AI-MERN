
const sendComparisonImage = require('./sendComparisonImage'); // Email image sending
const assessmentRoutes = require('./assessment'); 
const roadmapRoutes = require('./roadmap');

module.exports = function mainRoutes(app) {
  app.use('/api/send-comparison-image', sendComparisonImage); 
  app.use('/api/assessment', assessmentRoutes);
  app.use('/api/roadmap', roadmapRoutes);
};
