module.exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
    table.enu('role', ['editor', 'publisher']).notNullable().defaultTo('editor');
  });
};

module.exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('role');
  });
};
