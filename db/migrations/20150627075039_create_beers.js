module.exports.up = function(knex) {
  return knex.schema.createTable('beers', function(table) {
    table.increments('id').primary().notNullable();
    table.integer('brewery_id').notNullable();
    table.string('name').notNullable();
    table.integer('cat_id').notNullable();
    table.integer('style_id').notNullable();
    table.decimal('abv').notNullable().defaultsTo(0);
    table.decimal('ibu').notNullable().defaultsTo(0);
    table.decimal('srm').notNullable().defaultsTo(0);
    table.integer('upc').notNullable();
    table.text('image_url').notNullable();
    table.text('description').notNullable();
    table.dateTime('created_at').notNullable();
    table.dateTime('updated_at').notNullable();
  });
};

module.exports.down = function(knex) {
  return knex.schema.dropTable('beers');
};
