module.exports.up = function(knex) {
  return knex.raw("ALTER TABLE users ALTER COLUMN password DROP NOT NULL");
};

module.exports.down = function(knex) {
  return knex.raw("ALTER TABLE users ALTER COLUMN password SET NOT NULL");
};
