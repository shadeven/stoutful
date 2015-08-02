var request = require('supertest');
var moment = require('moment');
var urlencode = require('urlencode');
var factory = require('sails-factory');

var helpers = require('../../helpers/user');

describe.only('ActivityController', function () {

  before(function () {
    factory.load();
  });

  describe('#find()', function () {
    var accessToken;

    before(function (done) {
      var user = factory.build('user');
      User.create(user).exec(function (err) {
        if (err) return done(err);

        helpers.signIn(user, function (err, token) {
          accessToken = token;
          done(err);
        });
      });
    });

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
