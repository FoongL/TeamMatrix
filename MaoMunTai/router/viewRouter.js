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
    res.redirect('/test'); 
  }

  //double check main page URL
  router.get('/', (req, res) => {
    res.render('home');
  });

  router.get('/projects', (req, res) => {
    res.render('2', { title: '2', layout: 'project' });
  })




  //-------------test site:
  router.get('/test', (req, res) => {
    res.render('testLogin');
  })

  router.get('/testproject',isLoggedIn, (req, res) => {
    let user = req.session.passport.user;
    console.log(user)
    res.render('2', { title: '2', layout: 'projectTest' });
  })

  return router;
};
