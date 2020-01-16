// Require the necessary modules for this file.
const express = require('express');

// Setup a NoteRouter class which takes the note service as a dependency, that was we can inject the NoteService when we use our Router. As this is not a hard coded value we will need to inject the noteService for every instance of the note router.
class SubtaskRouter {
  constructor(subtaskService) {
    this.subtaskService = subtaskService;
  }

  // This utilises the express Router method, basically we are binding the path/ request to each restful verb
  router() {
    let router = express.Router();
    //router.get('/', this.get.bind(this));
    //router.post('/', this.post.bind(this));
    router.post('/add', this.addSubtask.bind(this));
    //router.put('/append/:index', this.put.bind(this));
    router.delete('/remove', this.deleteSubtask.bind(this));
    return router;
  }
  addSubtask(req, res) {
    //console.log(req.session.passport.user.id)
    //console.log(req.body.content, req.auth.user);
    return this.subtaskService
      .addSubtask(
        req.body.userID,
        req.body.taskID,
        req.body.name,
        req.body.dueDate
      )
      .then(notes => res.send('It works!'))
      .catch(err => res.status(500).json(err));
  }
  deleteSubtask(req, res) {
    return this.subtaskService
      .deleteSubtask(
        req.body.subtaskID
      )
      .then(notes => res.send('I deleted it!'))
      .catch(err => res.status(500).json(err));
  }



}

module.exports = SubtaskRouter;
