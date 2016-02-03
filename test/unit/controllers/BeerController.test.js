var factory = require('sails-factory');
var Barrels = require('barrels');
var request = require('supertest');
var helpers = require('../../helpers/user');

describe.only('BeerController', function () {
  before(function (done) {
    factory.load();
    var barrels = new Barrels();
    barrels.populate(function (err) {
      done(err);
    }, false);
  });

  describe('#stats()', function() {
    var john, accessToken;

    before(function(done) {
      Activity.create([{"beer_id": 1, "type": "like"}, {"beer_id": 1, "type": "check_in"}])
        .then(function() { done(); })
        .catch(done);
    });

    context('with signed in user', function() {
      before(function (done) {
        User.findOne({"email": "jsnow283@gmail.com"})
          .then(function(users) {
            john = users;
            helpers.signIn(john, function (err, token) {
              accessToken = token;
              done(err);
            });
          })
          .catch(done);
      });

      it('should return 200', function(done) {
        request(sails.hooks.http.app)
          .get('/api/beers/1/stats')
          .set('Authorization', 'Bearer ' + accessToken.access_token)
          .expect(200, done);
      });

      it ('should return the correct JSON', function(done) {
        var expectedJSON = factory.build('/api/beers/1/stats');
        request(sails.hooks.http.app)
          .get('/api/beers/1/stats')
          .set('Authorization', 'Bearer ' + accessToken.access_token)
          .expect(expectedJSON, done);
      });
    });

  });
});
