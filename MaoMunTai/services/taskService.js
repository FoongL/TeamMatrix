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

  deleteTask(TaskID) {
    return new Promise((res, rej) => {
      let delSubtask = this.knex('sub_task')
        .where('task_id', TaskID)
        .del();
      let delTaskAss = this.knex('task_assignment')
        .where('task_id', TaskID)
        .del();
      let delTask = this.knex('tasks')
        .where('id', TaskID)
        .del();
        delSubtask.then(()=>{
          return delTaskAss
        }).then(()=>{
          return delTask
        })
        .then(err => {
        res('Success');
      });
    });
  }

  addAssigned (TaskID, assUser){
    console.log('hi')
    return new Promise((res, rej) => {
      let assign =  this.knex
      .insert({
        user_id: assUser,
        task_id: TaskID
      })
      .into('task_assignment');
      assign.then(err => {
        res('Success');
      });
    });
  }








}

module.exports = TaskService;
