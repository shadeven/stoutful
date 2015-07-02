module.exports.up = function(knex) {
  return knex.schema.table('refresh_tokens', function(table) {
    table.dateTime('created_at').notNullable();
    table.dateTime('updated_at').notNullable();
  });
};

module.exports.down = function(knex) {
  return knex.schema.table('refresh_tokens', function (table) {
    table.dropColumns('created_at', 'updated_at');
  });
};
