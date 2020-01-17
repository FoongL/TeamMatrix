// Require the necessary modules for this file.
const express = require('express');

// Setup a NoteRouter class which takes the note service as a dependency, that was we can inject the NoteService when we use our Router. As this is not a hard coded value we will need to inject the noteService for every instance of the note router.
class ProjectRouter {
  constructor(projectService) {
    this.projectService = projectService;
  }

  // This utilises the express Router method, basically we are binding the path/ request to each restful verb
  router() {
    let router = express.Router();
    router.post('/add', this.addproject.bind(this));
    router.delete('/remove', this.deleteProject.bind(this));
    return router;
  }
  addproject(req, res) {
    return this.projectService
      .addProject(
        req.body.userId,
        req.body.name,
        req.body.desc,
        req.body.dueDate
      )
      .then(notes => res.send('It works!'))
      .catch(err => res.status(500).json(err));
  }

  deleteProject(req, res) {
    return this.projectService
      .deleteProject(
        req.body.projectId,
      )
      .then(notes => res.send('managed to clear the whole project'))
      .catch(err => res.status(500).json(err));
  }
}

module.exports = ProjectRouter;
