exports.up = function(knex) {
  return knex.schema.raw("ALTER TABLE users ALTER COLUMN image_url DROP NOT NULL");
};

exports.down = function(knex) {
  return knex.schema.raw("ALTER TABLE users ALTER COLUMN image_url SET NOT NULL");
};
