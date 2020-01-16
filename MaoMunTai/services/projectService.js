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
}

module.exports = ProjectService;
