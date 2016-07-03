module.exports.up = function(knex) {
  return knex.schema.createTable("clients", function(table) {
    table.increments("id").primary().notNullable();
    table.string("name").notNullable();
    table.string("client_id").notNullable();
    table.string("client_secret").notNullable();
    table.dateTime("created_at").notNullable();
    table.dateTime("updated_at").notNullable();
  });
};

module.exports.down = function(knex) {
  return knex.schema.dropTable("clients");
};
