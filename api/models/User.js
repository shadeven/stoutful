/**
* Users.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var Promise = require("bluebird");
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
      minLength: 8
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
    identities: {
      collection: 'UserIdentity',
      via: 'user'
    },
    role: {
      type: 'string',
      enum: ['editor', 'publisher']
    },
    isEditor: function() {
      var obj = this.toObject();
      return obj.role === 'editor';
    },
    isPublisher: function() {
      var obj = this.toObject();
      return obj.role === 'publisher';
    },
    toJSON: function() {
      // Filter out password
      var obj = this.toObject();
      delete obj.password;
      return obj;
    },
    verifyPassword: function(password) {
      var obj = this.toObject();
      var compare = Promise.promisify(bcrypt.compare);
      return compare(password, obj.password);
    }
  },

  beforeCreate: function(values, cb) {
    if (values.password) {
      bcrypt.hash(values.password, 10, function(err, hash) {
        if (err) {
          return cb(err);
        }
        values.password = hash;
        return cb();
      });
    } else {
      return cb();
    }
  },

  beforeUpdate: function(values, cb) {
    if (values.password) {
      values.updated_at = new Date();
      bcrypt.hash(values.password, 10, function(err, hash) {
        if (err) {
          return cb(err);
        }
        values.password = hash;
        return cb();
      });
    } else {
      return cb();
    }
  }
};
