/**
* Patch.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName: 'patches',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },
    editor: {
      type: 'integer',
      notNull: true,
      model: 'user'
    },
    model: {
      type: 'integer',
      notNull: true
    },
    type: {
      type: 'string',
      notNull: true
    },
    changes: {
      type: 'json',
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
    },
    deleted_at: {
      type: 'datetime'
    },
    toJSON: function() {
      var obj = this.toObject();
      if (obj.type === 'beer') {
        obj.modelUrl = '/api/beers/' + obj.model;
      }
      if (obj.type === 'brewery') {
        obj.modelUrl = '/api/breweries/' + obj.model;
      }
      return obj;
    }
  },
  beforeUpdate: function(values, cb) {
    values.updated_at = new Date();
    cb();
  }
};
