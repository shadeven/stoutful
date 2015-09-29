module.exports.up = function(knex) {
  return knex.schema.table('user_identities', function(table) {
    table.renameColumn('user_id', 'user');
  });
};

module.exports.down = function(knex) {
  return knex.schema.table('user_identities', function(table) {
    table.renameColumn('user', 'user_id');
  });
};
