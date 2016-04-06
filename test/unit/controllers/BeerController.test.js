/* global User, Activity */

var factory = require("sails-factory");
var request = require("../../helpers/supertest");
var helpers = require("../../helpers/helpers");

var testScope = this;

describe("BeerController", function () {

  before(function(done) {
    User.create(factory.build("user"))
      .then(function(user) { testScope.user = user; return user; })
      .then(helpers.createAccessToken)
      .spread(function(accessToken) {
        request.set("Authorization", "Bearer" + accessToken.access_token);
        done();
      })
      .catch(done);
  });

  after(function(done) {
    helpers.destroyModels()
      .then(function() { done(); })
      .catch(done);
  });

  describe("#stats()", function() {
    context("with signed in user", function() {
      before(function(done) {
        Beer.create(factory.build("beer"))
          .then(function(beer) {
            testScope.beer = beer;
            return Activity.create([
              factory.build("activity", {"beer": beer.id, "type": "like"}),
              factory.build("activity", {"beer": beer.id, "type": "check_in"})
            ]);
          })
          .then(function() {
            done();
          })
          .catch(done);
      });

      it("should return 200", function(done) {
        request(sails)
          .get("/api/beers/" + testScope.beer.id + "/stats")
          .expect(200, done);
      });

      it ("should return the correct JSON", function(done) {
        var expectedJSON = factory.build("/api/beers/1/stats");
        request(sails)
          .get("/api/beers/" + testScope.beer.id + "/stats")
          .expect(expectedJSON, done);
      });
    });

  });
});
