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
      delSubtask
        .then(() => {
          return delTaskAss;
        })
        .then(() => {
          return delTask;
        })
        .then(err => {
          res('Success');
        });
    });
  }

  addAssigned(TaskID, assUser) {
    return new Promise((res, rej) => {
      let assign = this.knex
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

  removeUser(TaskID, user) {
    return new Promise((res, rej) => {
      let remUser = this.knex('task_assignment')
        .where({ task_id: TaskID, user_id: user })
        .del();
      remUser.then(err => {
        res('Success');
      });
    });
  }

  amendName(TaskID, name) {
    return new Promise((res, rej) => {
      let amend = this.knex('tasks')
        .where('id', TaskID)
        .update({
          name: name
        });
      amend.then(err => {
        res('Success');
      });
    });
  }
  amendDesc(TaskID, description) {
    return new Promise((res, rej) => {
      let amend = this.knex('tasks')
        .where('id', TaskID)
        .update({
          desc: description
        });
      amend.then(err => {
        res('Success');
      });
    });
  }

  changeLabel(TaskID, newLabel) {
    return new Promise((res, rej) => {
      let amend = this.knex('tasks')
        .where('id', TaskID)
        .update({
          label: newLabel
        });
      amend.then(err => {
        res('Success');
      });
    });
  }

  startProject(TaskID) {
    return new Promise((res, rej) => {
      let amend = this.knex('tasks')
        .where('id', TaskID)
        .update({
          started: 'True'
        });
      amend.then(err => {
        res('Success');
      });
    });
  }

  unStartProject(TaskID) {
    return new Promise((res, rej) => {
      let amend = this.knex('tasks')
        .where('id', TaskID)
        .update({
          started: 'false'
        });
      amend.then(err => {
        res('Success');
      });
    });
  }

  archive(TaskID) {
    return new Promise((res, rej) => {
      let amend = this.knex('tasks')
        .where('id', TaskID)
        .update({
          archive: 'true'
        });
      amend.then(err => {
        res('Success');
      });
    });
  }

  unArchive(TaskID) {
    return new Promise((res, rej) => {
      let amend = this.knex('tasks')
        .where('id', TaskID)
        .update({
          archive: 'false'
        });
      amend.then(err => {
        res('Success');
      });
    });
  }

  phaseChange(TaskID, phase) {
    return new Promise((res, rej) => {
      let amend = this.knex('tasks')
        .where('id', TaskID)
        .update({
          phase: phase
        });
      amend.then(err => {
        res('Success');
      });
    }); 
  }

  amendDuedate(TaskID, dueDate) {
    return new Promise((res, rej) => {
      let amend = this.knex('tasks')
        .where('id', TaskID)
        .update({
          due_date: dueDate
        });
      amend.then(err => {
        res('Success');
      });
    }); 
  }

  markComplete(TaskID) {
    return new Promise((res, rej) => {
      var curTime = new Date();
      curTime =curTime.toISOString().slice(0, 10)+' 00:00:00+08';
      let tick = this.knex('tasks')
        .where('id', TaskID)
        .update({
          completed_date: curTime
        });
      tick.then(err => {
        res('Success');
      });
    });
  }
}

module.exports = TaskService;
