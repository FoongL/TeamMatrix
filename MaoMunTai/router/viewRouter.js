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
    res.redirect('/');
  }

  //double check main page URL
  router.get('/', (req, res) => {
    res.render('home');
  });

  router.get('/userpage', isLoggedIn, async (req, res) => {
    let user = req.session.passport.user;
    let projectlist = await projectService.listProject(user['id']);
    res.render('2', {
      projectList: projectlist,
      layout: 'project'
    });
  });

  router.get('/createproject', isLoggedIn, async (req, res) => {
    let user = req.session.passport.user;
    let projectlist = await projectService.listProject(user['id']);
    res.render('projectCreate', {
      projectList: projectlist,
      layout: 'project'
    });
  });

  router.get('/dashboard/:projectid', isLoggedIn, async (req, res) => {
    var curTime = new Date();
    curTime = new Date(curTime.toISOString().slice(0, 10) + ' 00:00:00+08');
    let user = req.session.passport.user;
    let projectlist = await projectService.listProject(user['id']);

    let projects = req.params.projectid;
    let projectDetails = await projectService.projectDetails(projects);
    let dueDate = new Date(projectDetails[0]['due_date']);
    let dateCountDown =
      (dueDate.getTime() - curTime.getTime()) / (1000 * 3600 * 24);
    if (dateCountDown == 0) {
      dateCountDown = 'DUE TODAY!';
    } else if (dateCountDown > 0) {
      dateCountDown = dateCountDown + ' Days Remaining';
    } else {
      dateCountDown = Math.abs(dateCountDown) + ' Days Overdue';
    }
    let months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
    let dateDue =
      dueDate.getDate() +
      ' ' +
      months[dueDate.getMonth()] +
      ', ' +
      dueDate.getFullYear();
    res.render('dashboard', {
      projectList: projectlist,
      projectID: projects,
      projectName: projectDetails[0]['name'],
      projectDesc: projectDetails[0]['desc'],
      projectDue: dateDue,
      daysLeft: dateCountDown,
      layout: 'project'
    });
  });

  router.get('/project/:projectid', isLoggedIn, async (req, res) => {
    var curTime = new Date();
    curTime = new Date(curTime.toISOString().slice(0, 10) + ' 00:00:00+08');
    let user = req.session.passport.user;
    let projectlist = await projectService.listProject(user['id']);

    let projects = req.params.projectid;
    let projectDetails = await projectService.projectDetails(projects);
    let assigned = await taskService.listTask(projects, 1);
    for (let x in assigned) {
      let checkDate = new Date(assigned[x]['due_date']);
      let taskCountDown = Math.round(
        (checkDate.getTime() - curTime.getTime()) / (1000 * 3600 * 24)
      );
      if (taskCountDown == 0) {
        assigned[x]['days_left'] = 'DUE TODAY!';
      } else if (taskCountDown > 0) {
        assigned[x]['days_left'] = taskCountDown + ' Days Remaining';
      } else {
        assigned[x]['days_left'] = Math.abs(taskCountDown) + ' Days Overdue';
      }
    }
    let inProgress = await taskService.listTask(projects, 2);
    for (let x in inProgress) {
      let checkDate = new Date(inProgress[x]['due_date']);
      let taskCountDown = Math.round(
        (checkDate.getTime() - curTime.getTime()) / (1000 * 3600 * 24)
      );
      if (taskCountDown == 0) {
        inProgress[x]['days_left'] = 'DUE TODAY!';
      } else if (taskCountDown > 0) {
        inProgress[x]['days_left'] = taskCountDown + ' Days Remaining';
      } else {
        inProgress[x]['days_left'] = Math.abs(taskCountDown) + ' Days Overdue';
      }
    }
    let completed = await taskService.listTask(projects, 3);
    for (let x in completed) {
      let checkDate = new Date(completed[x]['due_date']);
      let taskCountDown = Math.round(
        (checkDate.getTime() - curTime.getTime()) / (1000 * 3600 * 24)
      );
      if (taskCountDown == 0) {
        completed[x]['days_left'] = 'DUE TODAY!';
      } else if (taskCountDown > 0) {
        completed[x]['days_left'] = taskCountDown + ' Days Remaining';
      } else {
        completed[x]['days_left'] = Math.abs(taskCountDown) + ' Days Overdue';
      }
    }
    let dueDate = new Date(projectDetails[0]['due_date']);
    let dateCountDown =
      (dueDate.getTime() - curTime.getTime()) / (1000 * 3600 * 24);
    if (dateCountDown == 0) {
      dateCountDown = 'DUE TODAY!';
    } else if (dateCountDown > 0) {
      dateCountDown = dateCountDown + ' Days Remaining';
    } else {
      dateCountDown = Math.abs(dateCountDown) + ' Days Overdue';
    }
    let months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
    let dateDue =
      dueDate.getDate() +
      ' ' +
      months[dueDate.getMonth()] +
      ', ' +
      dueDate.getFullYear();
    res.render('projectDetails', {
      projectList: projectlist,
      projectID: projects,
      projectName: projectDetails[0]['name'],
      projectDesc: projectDetails[0]['desc'],
      projectDue: dateDue,
      daysLeft: dateCountDown,
      taskAssigned: assigned,
      taskInProgress: inProgress,
      takCompleted: completed,
      layout: 'project'
    });
  });

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  return router;
};
