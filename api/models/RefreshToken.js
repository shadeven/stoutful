/**
* RefreshToken.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName: 'refresh_tokens',
  attributes: {
    user_id: {
      type: 'integer'
    },
    token: {
      type: 'string'
    }
  }
};
