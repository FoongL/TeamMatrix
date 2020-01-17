//-------------- Setting up required packages
const path = require('path')


//-------------- Setting up routes
module.exports = express => {
  const router = express.Router();
  function isLoggedIn(req, res, next) {
    //using passport to see if user is logged in.
    if (req.isAuthenticated()) {
      return next();
    }
    //double check login or signup URL
    res.redirect('/login'); 
  }

  //double check main page URL
  router.get('/', (req, res) => {
    res.render('home');
  });

  return router;
};
