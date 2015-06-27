module.exports.up = function(knex) {
  return knex.schema.createTable('refresh_tokens', function(table) {
    table.increments('id').primary().notNullable();
    table.integer('user_id').notNull();
    table.text('token').notNull();
  });
};

module.exports.down = function(knex) {
  return knex.schema.dropTable('refresh_tokens');
};
