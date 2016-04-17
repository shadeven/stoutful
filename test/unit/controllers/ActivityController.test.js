/* global Brewery, Beer, Activity, User */

var factory = require("sails-factory");
var request = require("../../helpers/supertest");
var moment = require("moment");
var urlencode = require("urlencode");
var helpers = require("../../helpers/helpers");

var testScope = this;

describe("ActivityController", function () {
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
      .then(function() {
        done();
      })
      .catch(done);
  });

  describe("#find()", function () {
    context("with signed in user", function() {
      before(function (done) {
        Brewery.create(factory.build("brewery"))
          .then(function(brewery) {
            testScope.brewery = brewery;
            return Beer.create(factory.build("beer"));
          })
          .then(function(beer) {
            testScope.beer = beer;
            var attrs1 = factory.build("activity", {"type": "check_in", "user": testScope.user.id, "beer": beer.id});
            var attrs2 = factory.build("activity", {"type": "check_in", "user": testScope.user.id, "beer": beer.id});
            return Activity.create([attrs1, attrs2]);
          })
          .then(function(activities) {
            testScope.activities = activities;
            done();
          })
          .catch(done);
      });

      after(function (done) {
        Activity.destroy().exec(done);
      });

      it("should return all activities", function (done) {
        var expectedJSON = [factory.build("/api/activities", {
          "id": 1,
          "user": testScope.user.toJSON(),
          "timestamp": testScope.activities[0].timestamp.toISOString(),
          "beer": testScope.beer.toJSON()
        }), factory.build("/api/activities", {
          "id": 2,
          "user": testScope.user.toJSON(),
          "timestamp": testScope.activities[0].timestamp.toISOString(),
          "beer": testScope.beer.toJSON()
        })];

        request(sails)
          .get("/api/activities")
          .expect(expectedJSON, done);
      });
    });

    context("with end_date parameter", function () {
      var activity;

      before(function (done) {
        var attrs = factory.build("activity", {"id": 1, "type": "check_in", "user": testScope.user.id});
        Activity.create(attrs).exec(function (err, model) {
          activity = model;
          done(err);
        });
      });

      after(function (done) {
        Activity.destroy().exec(done);
      });

      it("should return 200", function (done) {
        var endDate = urlencode(moment().utc().add(1, "hours").format());
        request(sails)
          .get("/api/activities?end_date=" + endDate)
          .expect(200, done);
      });

      it("should return the correct JSON", function (done) {
        var expectedJSON = [factory.build("/api/activities", {
          "user": testScope.user.toJSON(),
          "timestamp": activity.timestamp.toISOString(),
          "beer": testScope.beer.toJSON()
        })];

        var endDate = urlencode(moment().utc().add(1, "hours").format());
        request(sails)
          .get("/api/activities?end_date=" + endDate)
          .expect(expectedJSON, done);
      });
    });

    context("with start_date parameter", function () {
      var activity;

      before(function (done) {
        var attrs = factory.build("activity", {"id": 1, "type": "check_in", "user": testScope.user.id});
        Activity.create(attrs).exec(function (err, model) {
          activity = model;
          done(err);
        });
      });

      after(function (done) {
        Activity.destroy().exec(done);
      });

      it("should return 200", function (done) {
        var startDate = urlencode(moment().utc().subtract(1, "hours").format());
        request(sails)
          .get("/api/activities?start_date=" + startDate)
          .expect(200, done);
      });

      it("should return the correct JSON", function (done) {
        var expectedJSON = [factory.build("/api/activities", {
          "user": testScope.user.toJSON(),
          "timestamp": activity.timestamp.toISOString(),
          "beer": testScope.beer.toJSON()
        })];

        var startDate = urlencode(moment().utc().subtract(1, "hours").format());
        request(sails)
          .get("/api/activities?start_date=" + startDate)
          .expect(expectedJSON, done);
      });
    });

  });

});
