const subscribeRoute = require('./subscribe');           // Email-only subscriptions
const subscribePathwayRoute = require('./subscribePathway'); // Pathway subscriptions
const courseRoute = require('./course');                 // Course enrollments
const cartRoute = require('./cart');                     // Cart handling
const sendComparisonImage = require('./sendComparisonImage'); // Email image sending
const roadmapRoute = require('./roadmap/roadmap');       // Roadmap generation

module.exports = function mainRoutes(app) {
  app.use('/api', subscribeRoute);            // /api/email-subscribe
  app.use('/api', subscribePathwayRoute);     // /api/pathway-subscribe
  app.use('/api', courseRoute);               // /api/course
  app.use('/api', cartRoute);                 // /api/cart
  app.use('/api/send-comparison-image', sendComparisonImage); 
  app.use('/api/roadmap', roadmapRoute);     // /api/roadmap
};
