var Sails = require('sails');

before(function (done) {
  // Set env mode to test
  process.env.NODE_ENV = 'test';

  // Increase the Mocha timeout so that Sails has enough time to lift.
  this.timeout(30 * 1000);

  Sails.lift(null, function (err) {
    if (err) return done(err);
    // Load any fixtures here
    done();
  });
});

after(function (done) {
  // Cleanup any fixtures
  Sails.lower(done);
});
