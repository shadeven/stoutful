/**
* Users.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var bcrypt = require('bcrypt');

module.exports = {
  tableName: 'users',
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
    password: {
      type: 'string',
      minLength: 8,
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
      type: 'string',
      required: false
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
    },
    toJSON: function() {
      // Filter out password
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },

  beforeCreate: function(values, cb) {
    bcrypt.hash(values.password, 10, function(err, hash) {
      if (err) cb(err);
      values.password = hash;
      cb();
    });
  },

  beforeUpdate: function(values, cb) {
    values.updated_at = new Date();
    if (values.password) {
      bcrypt.hash(values.password, 10, function(err, hash) {
        if (err) cb(err);
        values.password = hash;
        cb();
      });
    } else {
      cb();
    }
  }
};
