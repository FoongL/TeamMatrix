
exports.up = function(knex) {
    return knex.schema.createTable('user_project', table => {
        table
        .increments('id')
        .unique()
        .primary();
        table.integer('user_id').unsigned();
        table.integer('project_id').unsigned();
        table.boolean('admin');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.foreign('user_id').references('users.id');
        table.foreign('project_id').references('projects.id');   
    })
    .createTable('tasks', table =>{
        table
        .increments('id')
        .unique()
        .primary();
        table.string('name').notNull();
        table.string('desc');
        table.integer('project_id').unsigned();
        table.integer('created_by').unsigned();
        table.integer('phase').defaultTo('1');
        table.integer('label');
        table.boolean('started').defaultTo(false);
        table.boolean('archive').defaultTo(false);
        table.timestamp('due_date');
        table.timestamp('completed_date');
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.foreign('created_by').references('users.id');
        table.foreign('project_id').references('projects.id');   
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('user_project').dropTable('tasks');
};
