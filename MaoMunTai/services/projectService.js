const fs = require('fs');

class ProjectService {
  constructor(knex) {
    this.knex = knex;
    //this.notes = {};
    //this.listProjectPromise = this.listProject();
  }
  listProject(userID) {
    if (userID === undefined) {
      console.log('Something not right...');
    } else {
      return new Promise((res, rej) => {
        let listKnex = this.knex('projects')
          .join('user_project', 'user_project.project_id', 'projects.id')
          .join('users', 'users.id', 'user_project.user_id')
          .select('*')
          .where('users.id', userID)
          .orderBy('created_at');
        listKnex.then(rows => {
          res(rows);
        });
      });
    }
  }

  addProject(userID, name, desc, dueDate) {
    return new Promise((res, rej) => {
      let creation = this.knex
        .insert({ name: name, desc: desc, due_date: dueDate })
        .into('projects');
      let projID = this.knex
        .select('id')
        .from('projects')
        .where({ name: name, desc: desc, due_date: dueDate })
        .orderBy('created_at', 'desc')
        .limit('1');
      creation
        .then(async () => {
          //   let data = await projID;
          projID.then(async data => {
            //console.log(data[0]['id'])
            return this.knex
              .insert({
                user_id: userID,
                project_id: data[0]['id'],
                admin: 'true'
              })
              .into('user_project');
          });
        })
        .then(err => {
          res('Success');
        });
    });
  }

  amendName(projectID, name) {
    let amend = this.knex('projects')
      .where('id', projectID)
      .update({
        name: name
      });
    amend.then(err => {
      res('Success');
    });
  }

  amendDesc(projectID, description) {
    let amend = this.knex('projects')
      .where('id', projectID)
      .update({
        desc: description
      });
    amend.then(err => {
      res('Success');
    });
  }

  amendDuedate(projectID, dueDate) {
    let amend = this.knex('projects')
      .where('id', projectID)
      .update({
        due_date: dueDate
      });
    amend.then(err => {
      res('Success');
    });
  }

  completeProject(projectID) {
    return new Promise((res, rej) => {
      var curTime = new Date();
      curTime = curTime.toISOString().slice(0, 10) + ' 00:00:00+08';
      let tick = this.knex('projects')
        .where('id', projectID)
        .update({
          completed_date: curTime
        });
      tick.then(err => {
        res('Success');
      });
    });
  }

  deleteProject(projectID) {
    return new Promise((res, rej) => {
      let fetchTasks = this.knex
        .select('id')
        .from('tasks')
        .where({ project_id: projectID });
      let delUserProject = this.knex('user_project')
      .where('project_id', projectID)
      .del();
      let delProject = this.knex('projects')
        .where('id', projectID)
        .del();
      fetchTasks
        .then(data => {
          for (let x in data) {
            let TaskID = data[x]['id'];
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
              });
          }
        })
        .then(() => {
          return delUserProject;
        })
        .then(() => {
          return delProject;
        })
        .then(err => {
          res('Success');
        });
    });
  }
}

module.exports = ProjectService;
