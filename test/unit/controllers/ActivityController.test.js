var request = require('supertest');
var moment = require('moment');
var urlencode = require('urlencode');
var Barrels = require('barrels');

var helpers = require('../../helpers/user');

describe.only('ActivityController', function () {

  var accessToken;

  before(function (done) {
    // Load fixtures
    var barrels = new Barrels();
    barrels.populate(['user', 'activity'], function (err) {
      if (err) return done(err);

      var user = barrels.data.user[0];
      helpers.signIn(user, function (err, token) {
        accessToken = token;
        done(err);
      });
    });
  });

  describe('#find()', function () {
    context('with end_date parameter', function () {
      it('should return 200', function (done) {
        var startDate = urlencode("'" + moment().utc().format() + "'");
        request(sails.hooks.http.app)
          .get('/api/activities?end_date=' + startDate)
          .set('Authorization', 'Bearer ' + accessToken.access_token)
          .expect(200, done);
      });
    });
  });

});
