const subscribeRoute = require('./subscribe'); // for email-only
const subscribePathwayRoute = require('./subscribePathway'); // for pathway subscriptions
const courseRoute = require('./course'); // for course enrollments
const cartRoute = require('./cart'); // for cart handling
const sendComparisonImage = require('./sendComparisonImage');


module.exports = function mainRoutes(app, subscribedDB, registeredDB) {
  app.use('/api', subscribeRoute(subscribedDB));            // /api/email-subscribe
  app.use('/api', subscribePathwayRoute(subscribedDB));     // /api/pathway-subscribe
  app.use('/api', courseRoute(registeredDB));               // /api/course/enroll
  app.use('/api', cartRoute(registeredDB));                 // /api/cart
  app.use('/api/send-comparison-image', sendComparisonImage); 
 
};
