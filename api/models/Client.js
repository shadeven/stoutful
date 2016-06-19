/**
* Client.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName: "clients",
  attributes: {
    id: {
      type: "integer",
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: "string",
      required: true,
      notNull: true
    },
    clientId: {
      type: "string",
      columnName: "client_id",
      required: true,
      notNull: true
    },
    clientSecret: {
      type: "string",
      columnName: "client_secret",
      required: true,
      notNull: true
    },
    createdAt: {
      type: "datetime",
      columnName: "created_at",
    },
    updatedAt: {
      type: "datetime",
      columnName: "updated_at",
    }
  }
};
