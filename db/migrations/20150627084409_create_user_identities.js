module.exports.up = function(knex) {
  return knex.schema.createTable('user_identities', function(table) {
    table.increments('id').primary().notNullable();
    table.integer('user_id').notNull();
    table.string('provider_id').notNull();
    table.string('provider').notNull();
  });
};

module.exports.down = function(knex) {
  return knex.schema.dropTable('user_identities');
};
