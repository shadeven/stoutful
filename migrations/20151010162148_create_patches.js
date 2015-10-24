module.exports.up = function(knex) {
  return knex.schema.createTable('patches', function(table) {
    table.increments('id').primary().notNullable();
    table.integer('editor').notNullable();
    table.integer('model').notNullable();
    table.string('type').notNullable();
    table.json('changes').notNullable();
    table.dateTime('created_at').notNullable();
    table.dateTime('updated_at').notNullable();
  });
};

module.exports.down = function(knex) {
  return knex.schema.dropTable('patches');
};
