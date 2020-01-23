const fs = require('fs');

class TaskService {
  constructor(knex) {
    this.knex = knex;
  }
  listTask(projectID, phase) {
    return new Promise((res, rej) => {
      let listKnex = this.knex('tasks')
        .join('projects', 'tasks.project_id', 'projects.id')
        .select('tasks.id', 'tasks.name', 'tasks.due_date', 'tasks.label')
        .where({ 'projects.id': projectID, phase: phase })
        .orderBy('due_date');
      listKnex.then(rows => {
        res(rows);
      });
    });
  }
  getTaskId(userID, dueDate) {
    return new Promise((res, rej) => {
      let idGrab = this.knex('tasks')
        .select('id')
        .where({ due_date: dueDate, created_by: userID })
        .orderBy('due_date', 'DESC')
        .limit('1');
      idGrab.then(data => {
        res(data);
      });
    });
  }

  TaskDetails(taskID) {
    return new Promise((res, rej) => {
      let getTask = this.knex('tasks')
        .select('*').where('id',taskID)
        getTask.then(data => {
        res(data);
      });
    });
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
    console.log(TaskID)
    console.log(name)
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
          phase:'2',
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
      curTime = curTime.toISOString().slice(0, 10) + ' 00:00:00+08';
      let tick = this.knex('tasks')
        .where('id', TaskID)
        .update({
          completed_date: curTime,
          phase: '3'
        });
      tick.then(err => {
        res('Success');
      });
    });
  }

  listUsers(TaskID) {
    return new Promise((res, rej) => {
      let userList = this.knex('users')
        .join('task_assignment', 'users.id', 'task_assignment.user_id')
        .select('users.id', 'f_name', 'l_name', 'email')
        .where('task_assignment.task_id', TaskID);
        userList.then(data => {
        res(data);
      });
    });
  }
  phaseCheck(TaskID) {
    return new Promise((res, rej) => {
      let phaseCheck = this.knex('tasks')
        .select('phase')
        .where('id', TaskID);
        phaseCheck.then(data => {
        res(data);
      });
    });
  }
}

module.exports = TaskService;
