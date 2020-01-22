const fs = require('fs');

class SubtaskService {
  constructor(knex) {
    this.knex = knex;
    //this.notes = {};
    //this.listProjectPromise = this.listProject();
  }
  listSubtask(TaskID) {
      return new Promise((res, rej) => {
        let listKnex = this.knex('sub_task')
          .join('tasks', 'sub_task.task_id', 'tasks.id')
          .select('sub_task.id', 'sub_task.name', 'sub_task.due_date')
          .where('tasks.id', TaskID)
          .orderBy('sub_task.due_date');
        listKnex.then(rows => {
          res(rows);
        });
      });
  }

  addSubtask(taskID, name, dueDate) {
    return new Promise((res, rej) => {
      let creation = this.knex
        .insert({
          task_id: taskID,
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

  amendAssigned(subtaskID, assigned) {
    return new Promise((res, rej) => {
      let amend = this.knex('sub_task')
        .where('id', subtaskID)
        .update({
          assigned_to: assigned
        });
      amend.then(err => {
        res('Success');
      });
    });
  }
  amendName(subtaskID, name) {
    return new Promise((res, rej) => {
      let amend = this.knex('sub_task')
        .where('id', subtaskID)
        .update({
          name: name
        });
      amend.then(err => {
        res('Success');
      });
    });
  }

  amendDuedate(subtaskID, dueDate) {
    return new Promise((res, rej) => {
      let amend = this.knex('sub_task')
        .where('id', subtaskID)
        .update({
          due_date: dueDate
        });
      amend.then(err => {
        res('Success');
      });
    });
  }

  markComplete(subtaskID) {
    return new Promise((res, rej) => {
      var curTime = new Date();
      curTime =curTime.toISOString().slice(0, 10)+' 00:00:00+08';
      console.log(curTime)
      console.log('id:', subtaskID);
      let tick = this.knex('sub_task')
        .where('id', subtaskID)
        .update({
          completed_date: curTime
        });
      tick.then(err => {
        res('Success');
      });
    });
  }

  markUnComplete(subtaskID) {
    return new Promise((res, rej) => {
      let untick = this.knex('sub_task')
      .where('id', subtaskID)
      .update({
        completed_date: null
      });
      untick.then(err => {
        res('Success');
      });
    });
  }
}

module.exports = SubtaskService;
