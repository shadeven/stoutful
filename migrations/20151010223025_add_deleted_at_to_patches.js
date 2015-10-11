module.exports.up = function(knex) {
  return knex.schema.table('patches', function(table) {
    table.dateTime('deleted_at');
  });
};

module.exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('deleted_at');
  });
};
