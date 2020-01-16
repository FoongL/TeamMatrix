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
    //router.get('/', this.get.bind(this));
    //router.post('/', this.post.bind(this));
    router.post('/add', this.addTask.bind(this));
    //router.put('/append/:index', this.put.bind(this));
    //router.delete('/remove/:index', this.delete.bind(this));
    return router;
  }
  addTask(req, res) {
    //console.log(req.session.passport.user.id)
    //console.log(req.body.content, req.auth.user);
    return this.taskService
      .addTask(
        req.body.userID,
        req.body.projectID,
        req.body.name,
        req.body.desc,
        req.body.dueDate
      )
      .then(notes => res.send('It works!'))
      .catch(err => res.status(500).json(err));
  }
}

module.exports = TaskRouter;
