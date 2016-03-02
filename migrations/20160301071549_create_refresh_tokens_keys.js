module.exports.up = function(knex) {
  return knex.schema.table("refresh_tokens", function(table) {
    table.foreign("user_id").references("users.id");
  });
};

module.exports.down = function(knex) {
  return knex.schema.table("refresh_tokens", function(table) {
    table.dropForeign("user_id");
  });
};
