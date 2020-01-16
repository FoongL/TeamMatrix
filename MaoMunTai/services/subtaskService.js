const fs = require('fs');

class SubtaskService {
  constructor(knex) {
    this.knex = knex;
    //this.notes = {};
    //this.listProjectPromise = this.listProject();
  }
  listSubtask(userID, TaskID) {
    if (userID === undefined) {
      console.log('Something not right...');
    } else {
      return new Promise((res, rej) => {
        let listKnex = this.knex('sub_tasks')
          .join('tasks', 'sub_tasks.task_id', 'tasks.id')
          .select('*')
          .where('tasks.id', TaskID)
          .orderBy('due_date');
        listKnex.then(rows => {
          res(rows);
        });
      });
    }
  }

  addSubtask(assigned, taskID, name, dueDate) {
    return new Promise((res, rej) => {
      let creation = this.knex
        .insert({
          task_id: taskID,
          assigned_to: assigned,
          name: name,
          due_date: dueDate
        })
        .into('sub_task');
      creation.then(err => {
        res('Success');
      });
    });
  }

  deleteSubtask(subtaskID) {
    return new Promise((res, rej) => {
      let removeSubtask = this.knex('sub_task')
        .where('id', subtaskID)
        .del();
      removeSubtask.then(err => {
        res('Success');
      });
    });
  }
}

module.exports = SubtaskService;
