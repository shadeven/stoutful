/**
* ESBrewery.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  connection: "elasticsearch",
  attributes: {
    id: {
      type: "integer",
      primaryKey: true
    },
    name: {
      type: "string"
    },
    description: {
      type: "string"
    }
  }
};
