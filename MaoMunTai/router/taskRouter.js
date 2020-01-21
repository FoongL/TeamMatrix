// Require the necessary modules for this file.
const express = require('express');

// Setup a NoteRouter class which takes the note service as a dependency, that was we can inject the NoteService when we use our Router. As this is not a hard coded value we will need to inject the noteService for every instance of the note router.
class TaskRouter {
  constructor(taskService) {
    this.taskService = taskService;
  }

  // This utilises the express Router method, basically we are binding the path/ request to each restful verb
  router() {
    let router = express.Router();
    router.post('/add', this.addTask.bind(this));
    router.post('/getid', this.getid.bind(this));
    router.delete('/remove', this.deleteTask.bind(this));
    router.put('/adduser', this.addUser.bind(this));
    router.put('/removeuser', this.remUser.bind(this));
    router.put('/amendname', this.amendName.bind(this));
    router.put('/amenddesc', this.amendDesc.bind(this));
    router.put('/changelabel', this.changeLabel.bind(this));
    router.put('/startproject', this.startProject.bind(this));
    router.put('/archiveproject', this.archiveProject.bind(this));
    router.put('/phasechange', this.phaseChange.bind(this));
    router.put('/amendduedate', this.amendDuedate.bind(this));
    router.put('/taskcomplete', this.markCompleted.bind(this));
    return router;
  }
  addTask(req, res) {
    return this.taskService
      .addTask(
        req.session.passport.user.id,
        req.body.projectID,
        req.body.name,
        req.body.desc,
        req.body.dueDate
      )
      .then(notes => res.send('Added New Task'))
      .catch(err => res.status(500).json(err));
  }

  getid(req, res) {
    return this.taskService
      .getTaskId(
        req.session.passport.user.id,
        //req.body.userID,
        req.body.dueDate
      )
      .then(data => res.json(data))
      .catch(err => res.status(500).json(err));
  }


  deleteTask(req, res) {
    return this.taskService
      .addTask(req.body.tasksID)
      .then(notes => res.send('Deleted tasks and related stuff'))
      .catch(err => res.status(500).json(err));
  }
  addUser(req, res) {
    return this.taskService
      .addAssigned(req.body.tasksID, req.body.user)
      .then(notes => res.send('Added new user to the task'))
      .catch(err => res.status(500).json(err));
  }

  remUser(req, res) {
    return this.taskService
      .removeUser(req.body.tasksID, req.body.user)
      .then(notes => res.send('deleted user from task'))
      .catch(err => res.status(500).json(err));
  }

  amendName(req, res){
    return this.taskService
      .amendName(req.body.tasksID, req.body.name)
      .then(notes => res.send('task name has been changed!'))
      .catch(err => res.status(500).json(err));
  }

  amendDesc(req, res){
    return this.taskService
      .amendDesc(req.body.tasksID, req.body.description)
      .then(notes => res.send('task description has been changed!'))
      .catch(err => res.status(500).json(err));
  }

  changeLabel(req, res){
    return this.taskService
      .changeLabel(req.body.tasksID, req.body.label)
      .then(notes => res.send('task label has been changed!'))
      .catch(err => res.status(500).json(err));
  }

  startProject(req, res){
    return this.taskService
      .startProject(req.body.tasksID)
      .then(notes => res.send('Task has been started or un-started!'))
      .catch(err => res.status(500).json(err));
  }

  archiveProject(req, res){
    return this.taskService
      .archive(req.body.tasksID)
      .then(notes => res.send('Task has been archived!'))
      .catch(err => res.status(500).json(err));
  }

  phaseChange(req, res){
    return this.taskService
      .phaseChange(req.body.tasksID, req.body.phase)
      .then(notes => res.send('Task phase has changed'))
      .catch(err => res.status(500).json(err));
  }

 amendDuedate(req, res){
    return this.taskService
      .amendDuedate(req.body.tasksID, req.body.dueDate)
      .then(notes => res.send('Task due date has been amended'))
      .catch(err => res.status(500).json(err));
  }

  markCompleted(req, res){
    return this.taskService
      .markComplete(req.body.tasksID)
      .then(notes => res.send('Task has been completed!'))
      .catch(err => res.status(500).json(err));
  }

  
  


}

module.exports = TaskRouter;
