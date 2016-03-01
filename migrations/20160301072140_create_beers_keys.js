module.exports.up = function(knex) {
  return knex.schema.table("beers", function(table) {
    table.foreign("brewery_id").references("breweries.id");
    table.foreign("cat_id").references("categories.id");
    table.foreign("style_id").references("styles.id");
  });
};

module.exports.down = function(knex) {
  return knex.schema.table("beers", function(table) {
    table.dropForeign("brewery_id");
    table.dropForeign("cat_id");
    table.dropForeign("style_id");
  });
};
