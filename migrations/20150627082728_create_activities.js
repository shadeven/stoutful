module.exports.up = function(knex) {
  return knex.schema.createTable('activities', function(table) {
    table.increments('id').primary().notNullable();
    table.integer('user_id').notNullable();
    table.integer('beer_id').notNullable();
    table.string('type').notNullable();
    table.unique(['user_id', 'beer_id', 'type']);
    table.dateTime('timestamp').notNullable();
  });
};

module.exports.down = function(knex) {
  return knex.schema.dropTable('activities');
};
