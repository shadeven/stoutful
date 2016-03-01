module.exports.up = function(knex) {
  return knex.schema.table("user_identities", function(table) {
    table.foreign("user").references("users.id");
  });
};

module.exports.down = function(knex) {
  return knex.schema.table("user_identities", function(table) {
    table.dropForeign("user");
  });
};
