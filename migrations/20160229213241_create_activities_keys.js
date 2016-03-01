module.exports.up = function(knex) {
  return knex.schema.table("activities", function(table) {
    table.foreign("user_id").references("users.id");
    table.foreign("beer_id").references("beers.id");
  });
};

module.exports.down = function(knex) {
  return knex.schema.table("activities", function(table) {
    table.dropForeign("user_id");
    table.dropForeign("beer_id");
  });
};
