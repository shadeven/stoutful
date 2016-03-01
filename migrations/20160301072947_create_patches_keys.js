module.exports.up = function(knex) {
  return knex.schema.table("patches", function(table) {
    table.foreign("editor").references("users.id");
  });
};

module.exports.down = function(knex) {
  return knex.schema.table("patches", function(table) {
    table.dropForeign("editor");
  });
};
