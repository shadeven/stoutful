/**
* Breweries.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName: 'breweries',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: 'string',
      notNull: true
    },
    address1: {
      type: 'string',
      notNull: true
    },
    address2: {
      type: 'string',
      notNull: true
    },
    city: {
      type: 'string',
      notNull: true
    },
    state: {
      type: 'string',
      notNull: true
    },
    code: {
      type: 'string',
      notNull: true
    },
    country: {
      type: 'string',
      notNull: true
    },
    phone: {
      type: 'string',
      notNull: true
    },
    website: {
      type: 'string',
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
