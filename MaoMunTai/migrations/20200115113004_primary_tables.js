
exports.up = function(knex) {
    return knex.schema.createTable('users', table => {
        table
          .increments('id')
          .unique()
          .primary();
        table.string('f_name');
        table.string('l_name');
        table.string('username');
        table.string('email').unique().notNull();
        table.boolean('dark_mode').defaultTo('false')
        table.string('password');
        table.string('facebookID');
        table.string('googleID');
        table.string('accessToken');
        table.timestamp('created_at').defaultTo(knex.fn.now());
      })
      .createTable('projects', table=> {
        table
        .increments('id')
        .unique()
        .primary();
        table.string('name');
        table.string('desc');
        table.timestamp('due_date');
        table.timestamp('completed_date');
        table.timestamp('created_at').defaultTo(knex.fn.now());
      })
};

exports.down = function(knex) {
    return knex.schema.dropTable('users').dropTable('projects');
};
