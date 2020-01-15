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
  router.get('/secret', isLoggedIn, (req, res) => {
    res.send('Here you go, a secret');
  });

  //double check login or signup URL
  router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname,'../public/login.html'));
  });

  router.post(
    '/login',
    passport.authenticate('local-login', {
      successRedirect: '/secret',
      failureRedirect: '/error'
    })
  );
//double check ERROR URL
  router.get('/error', (req, res) => {
    res.send('You are not logged in!');
  });
//double check main page URL
  router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'../public/index.html'));
  });
//double check signup URL
  router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname,'../public/signUp.html'));
  });

  //re-direct to our welcome page?
  router.post(
    '/signup',
    passport.authenticate('local-signup', {
      successRedirect: '/secret',
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
      successRedirect: '/secret',

      failureRedirect: '/login'
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
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/secret');
    }
  );

  return router;
};
