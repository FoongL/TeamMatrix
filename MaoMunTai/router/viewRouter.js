//-------------- Setting up required packages
const path = require('path');
const knexConfig = require('../knexfile').development;
const knex = require('knex')(knexConfig);


//-------------- Setting up required services
const ProjectService = require('../services/projectService');
const projectService = new ProjectService(knex);

const TaskService = require('../services/taskService');
const taskService = new TaskService(knex);

const SubtaskService = require('../services/subtaskService');
const subtaskService = new SubtaskService(knex);

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
  });

  //-------------test site:
  router.get('/test', (req, res) => {
    res.render('testLogin');
  });

  router.get('/testproject', isLoggedIn, (req, res) => {
    let user = req.session.passport.user;
    console.log(user.id);
    res.render('2', { title: '2', layout: 'projectTest' });
  });

  router.get('/testprojectone', isLoggedIn, (req, res) => {
    let user = req.session.passport.user;
    console.log(user.id);
    let projects = projectService.listProject(user.id)
    console.log(projects)
    res.render('projectDetails', { title: '2', layout: 'projectTest' });
  });

  return router;
};
