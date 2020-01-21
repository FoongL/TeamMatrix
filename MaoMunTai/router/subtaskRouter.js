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
    router.post('/add', this.addSubtask.bind(this));
    router.delete('/remove', this.deleteSubtask.bind(this));
    router.put('/amassigned', this.amendPerson.bind(this));
    router.put('/amname', this.amendName.bind(this));
    router.put('/amdate', this.amendDuedate.bind(this));
    router.put('/mark', this.markComplete.bind(this));
    router.put('/unmark', this.markUnComplete.bind(this));
    return router;
  }
  addSubtask(req, res) {
    //console.log(req.session.passport.user.id)
    //console.log(req.body.content, req.auth.user);
    return this.subtaskService
      .addSubtask(
        req.body.taskID,
        req.body.name,
        req.body.dueDate
      )
      .then(notes => res.send('added a subtask'))
      .catch(err => res.status(500).json(err));
  }
  deleteSubtask(req, res) {
    return this.subtaskService
      .deleteSubtask(
        req.body.subtaskID
      )
      .then(notes => res.send('deleted subtask'))
      .catch(err => res.status(500).json(err));
  }

  amendPerson(req, res) {
    return this.subtaskService
      .amendAssigned(
        req.body.subtaskID,
        req.body.userID
      )
      .then(notes => res.send('I amended assigned user'))
      .catch(err => res.status(500).json(err));
  }

  amendName(req, res) {
    return this.subtaskService
      .amendName(
        req.body.subtaskID,
        req.body.name
      )
      .then(notes => res.send('I amended subtask name'))
      .catch(err => res.status(500).json(err));
  }

  amendDuedate(req, res) {
    return this.subtaskService
      .amendDuedate(
        req.body.subtaskID,
        req.body.dueDate
      )
      .then(notes => res.send('I amended subtask name'))
      .catch(err => res.status(500).json(err));
  }

  markComplete(req, res) {
    return this.subtaskService
      .markComplete(
        req.body.subtaskID,
      )
      .then(notes => res.send('I mark completed!'))
      .catch(err => res.status(500).json(err));
  }

  markUnComplete(req, res) {
    return this.subtaskService
      .markUnComplete(
        req.body.subtaskID,
      )
      .then(notes => res.send('I unmarked completed!'))
      .catch(err => res.status(500).json(err));
  }

}

module.exports = SubtaskRouter;
