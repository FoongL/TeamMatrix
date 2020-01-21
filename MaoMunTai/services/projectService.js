const fs = require('fs');

class ProjectService {
  constructor(knex) {
    this.knex = knex;
    //this.notes = {};
    //this.listProjectPromise = this.listProject();
  }
  listProject(userID) {
    return new Promise((res, rej) => {
      let listKnex = this.knex('projects')
        .join('user_project', 'user_project.project_id', 'projects.id')
        .join('users', 'users.id', 'user_project.user_id')
        .select(
          'projects.id',
          'projects.name',
          'projects.desc',
          'projects.due_date'
        )
        .where('users.id', userID)
        .orderBy('projects.created_at');
      listKnex.then(rows => {
        res(rows);
      });
    });
  }
  projectDetails(projectID) {
    return new Promise((res, rej) => {
      let listKnex = this.knex('projects')
        .select('*')
        .where('id', projectID);
      listKnex.then(rows => {
        res(rows);
      });
    });
  }

  projectUsers(projectID) {
    return new Promise((res, rej) => {
      let listUsers = this.knex('users')
        .join('user_project', 'users.id', 'user_project.user_id')
        .select('users.id', 'f_name', 'l_name', 'email')
        .where('user_project.project_id', projectID);
      listUsers.then(rows => {
        res(rows);
      });
    });
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
  addUser(projectID, user) {
    return new Promise((res, rej) => {
      let addUser = this.knex
        .insert({
          user_id: user,
          project_id: projectID
        })
        .into('user_project');
      addUser.then(err => {
        res('Success');
      });
    });
  }

  removeUser(projectID, user) {
    return new Promise((res, rej) => {
      let remUser = this.knex('user_project')
        .where({
          project_id: projectID,
          user_id: user
        })
        .del();
      remUser.then(err => {
        res('Success');
      });
    });
  }

  checkAdmin(projectID) {
    return new Promise((res, rej) => {
      let adminCheck = this.knex
        .select('id')
        .from('user_project')
        .where({
          project_id: 'projectID',
          admin: 'true'
        });
      adminCheck
        .then(data => {
          if (data[0].length == 0) {
            let oldestUser = this.knex
              .select('id')
              .from('user_project')
              .where({
                project_id: 'projectID'
              })
              .orderBy('created_at')
              .limit('1');

            oldestUser.then(newUser => {
              let newAdmin = newUser[0]['id'];
              return this.knex('user_project')
                .where('id', newAdmin)
                .update({
                  admin: true
                });
            });
          }
        })

        .then(err => {
          res('Success');
        });
    });
  }
}

module.exports = ProjectService;
