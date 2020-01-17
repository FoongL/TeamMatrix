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
    router.delete('/remove', this.deleteTask.bind(this));
    router.put('/adduser', this.addUser.bind(this));
    return router;
  }
  addTask(req, res) {
    return this.taskService
      .addTask(
        req.body.userID,
        req.body.projectID,
        req.body.name,
        req.body.desc,
        req.body.dueDate
      )
      .then(notes => res.send('Added New Task'))
      .catch(err => res.status(500).json(err));
  }

  deleteTask(req, res) {
    return this.taskService
      .addTask(
        req.body.tasksID,
      )
      .then(notes => res.send('Deleted tasks and related stuff'))
      .catch(err => res.status(500).json(err));
  }
  addUser(req, res) {
    return this.taskService
      .addAssigned(
        req.body.tasksID,
        req.body.user,
      )
      .then(notes => res.send('Added new user to the task'))
      .catch(err => res.status(500).json(err));
  }




}

module.exports = TaskRouter;
