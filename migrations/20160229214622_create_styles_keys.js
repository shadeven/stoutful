module.exports.up = function(knex) {
  return knex.schema.table("styles", function(table) {
    table.foreign("cat_id").references("categories.id");
  });
};

module.exports.down = function(knex) {
  return knex.schema.table("styles", function(table) {
    table.dropForeign("cat_id");
  });
};
