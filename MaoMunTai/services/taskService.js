const fs = require('fs');

class TaskService {
  constructor(knex) {
    this.knex = knex;
    //this.notes = {};
    //this.listProjectPromise = this.listProject();
  }
  listTask(userID, projectID) {
    if (userID === undefined) {
      console.log('Something not right...');
    } else {
      return new Promise((res, rej) => {
        let listKnex = this.knex('tasks')
          .join('projects', 'tasks.project_id', 'projects.id')
          .select('*')
          .where('projects.id', projectID)
          .groupBy('phase');
        listKnex.then(rows => {
          res(rows);
        });
      });
    }
  }

  addTask(userID, projectID, name, desc, dueDate) {
    return new Promise((res, rej) => {
      let creation = this.knex
        .insert({
          project_id: projectID,
          created_by: userID,
          name: name,
          desc: desc,
          due_date: dueDate
        })
        .into('tasks');
      creation.then(err => {
        res('Success');
      });
    });
  }
}

module.exports = TaskService;
