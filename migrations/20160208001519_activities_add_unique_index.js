module.exports.up = function(knex) {
  return knex.schema.table('activities', function(table) {
    table.unique(['user_id', 'beer_id', 'type']);
  });
};

module.exports.down = function(knex) {
  return knex.schema.table('activities', function(table) {
    table.dropUnique(['user_id', 'beer_id', 'type']);
  });
};
