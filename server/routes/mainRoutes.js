
const sendComparisonImage = require('./sendComparisonImage'); // Email image sending
const assessmentRoutes = require('./assessment'); 

module.exports = function mainRoutes(app) {
  app.use('/api/send-comparison-image', sendComparisonImage); 
  app.use('/api/assessment', assessmentRoutes);
};
