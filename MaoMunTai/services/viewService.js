const fs = require('fs');

class ViewtService {
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


}

module.exports = ViewtService ;
