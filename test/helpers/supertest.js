var supertest = require("supertest");
var config = {};

module.exports = function(sails) {
  return {
    agent: supertest(sails.hooks.http.app),
    get: function(url) {
      var r = this.agent.get(url);
      Object.keys(config).forEach(function(key) {
        r.set(key, config[key]);
      });
      return r;
    }
  };
};

module.exports.set = function(key, value) {
  config[key] = value;
};
