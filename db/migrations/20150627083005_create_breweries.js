module.exports.up = function(knex) {
  return knex.schema.createTable('breweries', function(table) {
    table.increments('id').primary().notNullable();
    table.string('name').notNullable();
    table.string('address1').notNullable();
    table.string('address2').notNullable();
    table.string('city').notNullable();
    table.string('code').notNullable();
    table.string('country').notNullable();
    table.string('phone').notNullable();
    table.string('website').notNullable();
    table.text('image_url').notNullable();
    table.text('description').notNullable();
    table.dateTime('created_at').notNullable();
    table.dateTime('updated_at').notNullable();
  });
};

module.exports.down = function(knex) {
  return knex.schema.dropTable('breweries');
};
