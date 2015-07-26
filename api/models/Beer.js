/**
* Beers.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  connection: ['pg', 'elasticsearch'],
  tableName: 'beers',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },
    brewery_id: {
      type: 'integer',
      notNull: true,
      required: true
    },
    name: {
      type: 'string',
      notNull: true
    },
    cat_id: {
      type: 'integer',
      notNull: true,
      required: true
    },
    style_id: {
      type: 'integer',
      notNull: true,
      required: true
    },
    abv: {
      type: 'float',
      notNull: true
    },
    ibu: {
      type: 'float',
      notNull: true
    },
    srm: {
      type: 'float',
      notNull: true
    },
    upc: {
      type: 'integer',
      notNull: true
    },
    image_url: {
      type: 'string',
      notNull: true
    },
    description: {
      type: 'string',
      notNull: true
    },
    created_at: {
      type: 'datetime',
      notNull: true,
      defaultsTo: function() {
        return new Date();
      }
    },
    updated_at: {
      type: 'datetime',
      notNull: true,
      defaultsTo: function() {
        return new Date();
      }
    }
  },
  beforeUpdate: function(values, cb) {
    values.updated_at = new Date();
    cb();
  }
};
