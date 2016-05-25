var factory = require("sails-factory");
var sinon = require("sinon");
var Promise = require("bluebird");

var request = require("../../helpers/supertest");
var helpers = require("../../helpers/helpers");

describe("SearchController", function() {
  before(function(done) {
    User.create(factory.build("user"))
      .then(helpers.createAccessToken)
      .spread(function(accessToken) {
        request.set("Authorization", "Bearer " + accessToken.token);
        done();
      })
      .catch(done);
  });

  describe("#search()", function() {
    var result;
    var sandbox = sinon.sandbox.create();

    before(function(done) {
      // Create models
      Beer.create([factory.build("beer", {name: "Beer 1"}), factory.build("beer", {name: "Beer 2"})])
        .then(function() { done(); })
        .catch(done);
    });

    after(function(done) {
      // Clean up models
      Beer.destroy().then(function() { done(); }).catch(done);
    });

    context("with single type", function() {
      beforeEach(function() {
        // Stub Elasticsearch
        sandbox.stub(Elasticsearch, "search", function() {
          return Promise.resolve({
            hits: {
              hits: [
                {
                  "_type": "beer",
                  "_id": 1,
                  "_source": {
                    "name": "Beer 1"
                  }
                },
                {
                  "_type": "beer",
                  "_id": 2,
                  "_source": {
                    "name": "Beer 2"
                  }
                }
              ]
            }
          })
        });

        result = request(sails)
          .get("/api/search")
          .query({type: "beer", query: "lorem"});
      });

      afterEach(function() {
        // Restore all stubs back to normal
        sandbox.restore();
      });

      it("should return 200", function(done) {
        result.expect(200, done);
      });

      it("should return correct JSON", function(done) {
        var expected = [
          {
            id: 1,
            name: "Beer 1"
          },
          {
            id: 2,
            name: "Beer 2"
          }
        ];
        result.expect(expected, done);
      });
    });
  });
});
