module.exports.up = function(knex) {
  return knex.schema.createTable('categories', function(table) {
    table.increments('id').primary().notNullable();
    table.string('name').notNullable();
    table.dateTime('created_at').notNullable();
    table.dateTime('updated_at').notNullable();
  });
};

module.exports.down = function(knex) {
  return knex.schema.dropTable('categories');
};
