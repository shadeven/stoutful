/**
* Activities.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var moment = require('moment');

module.exports = {
  tableName: 'activities',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },
    user: {
      type: 'integer',
      columnName: 'user_id',
      model: 'user'
    },
    beer_id: {
      type: 'integer',
      required: true,
      notNull: true
    },
    timestamp: {
      type: 'datetime',
      notNull: true,
      defaultsTo: function() {
        return moment().utc().toDate();
      }
    },
    type: {
      type: 'string',
      required: true
    }
  }
};
