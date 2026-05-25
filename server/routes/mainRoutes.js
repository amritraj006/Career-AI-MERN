
const sendComparisonImage = require('./sendComparisonImage'); // Email image sending
const assessmentRoutes = require('./assessment'); 
const roadmapRoutes = require('./roadmap');
const interviewRoutes = require('./interview');
const statsRoutes = require('./stats');

module.exports = function mainRoutes(app) {
  app.use('/api/send-comparison-image', sendComparisonImage); 
  app.use('/api/assessment', assessmentRoutes);
  app.use('/api/roadmap', roadmapRoutes);
  app.use('/api/interview', interviewRoutes);
  app.use('/api/stats', statsRoutes);
};
