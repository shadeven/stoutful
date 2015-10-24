module.exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary().notNullable();
    table.string('email').notNullable();
    table.text('password').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.text('image_url').notNullable();
    table.dateTime('created_at').notNullable();
    table.dateTime('updated_at').notNullable();
  });
};

module.exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
