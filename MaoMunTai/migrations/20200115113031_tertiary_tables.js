
exports.up = function(knex) {
    return knex.schema.createTable('task_assignment', table => {
        table
        .increments('id')
        .unique()
        .primary();
        table.integer('user_id').unsigned();
        table.integer('task_id').unsigned();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.foreign('user_id').references('users.id');
        table.foreign('task_id').references('tasks.id'); 
    })
    .createTable('sub_task', table =>{
        table
        .increments('id')
        .unique()
        .primary();
        table.string('name').notNull();
        table.integer('assigned_to').unsigned();
        table.integer('task_id').unsigned();
        table.timestamp('completed_date');
        table.timestamp('due_date');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.foreign('assigned_to').references('users.id');
        table.foreign('task_id').references('tasks.id')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('task_assignment').dropTable('sub_task');
};
