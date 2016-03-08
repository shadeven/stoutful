/**
 * This is a supertest helper that allows us to use `set` methods PRIOR to
 * creating a request.
 */

var supertest = require("supertest");
var config = {};

module.exports = function(sails) {
  var proxy = {
    agent: supertest(sails.hooks.http.app)
  };

  Object.keys(proxy.agent).forEach(function(method) {
    proxy[method] = function(url) {
      var r = this.agent[method].call(this, url);
      Object.keys(config).forEach(function(key) {
        r.set(key, config[key]);
      });
      return r;
    };
  });

  return proxy;
};

module.exports.set = function(key, value) {
  config[key] = value;
};
