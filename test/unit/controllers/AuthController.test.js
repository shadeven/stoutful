var request = require("../../helpers/supertest");
var factory = require("sails-factory");
var helpers = require("../../helpers/helpers");

describe("AuthController", function() {

  before(function(done) {
    User.create(factory.build("user"))
      .then(function() { done(); })
      .catch(done);
  });

  after(function(done) {
    User.destroy()
      .then(function() {
        done();
      })
      .catch(done);
  });

  describe("#token()", function() {
    context("with invalid body", function() {
      it("should return 400", function(done) {
        request(sails)
          .post("/oauth/token")
          .expect(400, done);
      });
    });

    context("with password", function() {
      it("should return 201", function(done) {
        request(sails)
          .post("/oauth/token")
          .send({ username: "jsnow283@gmail.com", password: "theonlybastardchild", grant_type: "password" })
          .expect(201, done);
      });
    });
  });

  describe("#login()", function() {
    context("with basic", function() {
      it("should return 200", function(done) {
        var auth = new Buffer("jsnow283@gmail.com:theonlybastardchild").toString("base64");
        request.set("Authorization", "Basic " + auth);
        request(sails)
          .post("/login/basic")
          .expect(200, done);
      });
    });
  });
});
