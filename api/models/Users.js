/**
* Users.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: 'email',
      notNull: true,
      unique: true,
      required: true
    },
    first_name: {
      type: 'string',
      notNull: true,
      required: true
    },
    last_name: {
      type: 'string',
      notNull: true,
      required: true
    },
    image_url: {
      type: 'string'
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

