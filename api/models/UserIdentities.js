/**
* UserIdentities.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  autoCreatedAt: false,
  autoUpdatedAt: false,
  tableName: 'user_identities',
  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: 'integer',
      notNull: true
    },
    provider_id: {
      type: 'integer',
      notNull: true
    },
    provider: {
      type: 'string',
      notNull: true
    }
  }
};

