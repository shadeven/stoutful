var factory = require("sails-factory");
var Sails = require('sails');

before(function (done) {
  // Set env mode to test
  process.env.NODE_ENV = 'test';

  // Increase the Mocha timeout so that Sails has enough time to lift.
  this.timeout(30 * 1000);
  Sails.lift({ hooks: { grunt: false, gulp: false } }, function() {
    factory.load();
    done();
  });
});

after(function (done) {
  Sails.lower(done);
});
