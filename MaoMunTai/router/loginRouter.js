//-------------- Setting up required packages
const passport = require('passport');
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
   //double check user homepage URL
  // router.get('/secret', isLoggedIn, (req, res) => {
  //   res.send('Here you go, a secret');
  // });

  router.post(
    '/login',
    passport.authenticate('local-login', {
      successRedirect: '/testproject',
      failureRedirect: '/error'
    })
  );
//double check ERROR URL
  router.get('/error', (req, res) => {
    res.send('You are not logged in!');
  });

  //re-direct to our welcome page?
  router.post(
    '/signup',
    passport.authenticate('local-signup', {
      successRedirect: '/testproject',
      failureRedirect: '/error'
    })
  );

  // facebook Authentication
  router.get(
    '/auth/facebook',
    passport.authenticate('facebook', {
      scope: ['email', 'user_gender', 'user_link']
    })
  );

  router.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/testproject',

      failureRedirect: '/'
    })
  );

  // google authentication
  router.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: [
        'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    })
  );

  router.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    function(req, res) {
      res.redirect('/testproject');
    }
  );

  return router;
};
