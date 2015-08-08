/* global User, Activity */

var request = require('supertest');
var moment = require('moment');
var urlencode = require('urlencode');
var factory = require('sails-factory');
var Barrels = require('barrels');
var helpers = require('../../helpers/user');

describe.only('ActivityController', function () {

  before(function (done) {
    factory.load();
    var barrels = new Barrels();
    barrels.populate(['user', 'brewery', 'beer'], function (err) {
      done(err);
    });
  });

  describe('#find()', function () {
    var accessToken;

    before(function (done) {
      User.find().limit(1).exec(function (err, users) {
        if (err) return done(err);
        helpers.signIn(users[0], function (err, token) {
          accessToken = token;
          done(err);
        });
      });
    });

    context('with end_date parameter', function () {
      var activity;

      before(function (done) {
        var attrs = factory.build('activity', {"id": 1, "type": "check_in"});
        Activity.create(attrs).exec(function (err, model) {
          activity = model;
          done(err);
        });
      });

      after(function (done) {
        Activity.destroy().exec(function (err) {
          done(err);
        });
      });

      it('should return 200', function (done) {
        var endDate = urlencode(moment().utc().add(1, 'hours').format());
        request(sails.hooks.http.app)
          .get('/api/activities?end_date=' + endDate)
          .set('Authorization', 'Bearer ' + accessToken.access_token)
          .expect(200, done);
      });

      it('should return the correct JSON', function (done) {
        var expectedJSON = [factory.build('/api/activities', {
          'timestamp': activity.timestamp.toJSON()
        })];

        var endDate = urlencode(moment().utc().add(1, 'hours').format());
        request(sails.hooks.http.app)
          .get('/api/activities?end_date=' + endDate)
          .set('Authorization', 'Bearer ' + accessToken.access_token)
          .expect(expectedJSON, done);
      });
    });

    context('with start_date parameter', function () {
      var activity;

      before(function (done) {
        var attrs = factory.build('activity', {"id": 1, "type": "check_in"});
        Activity.create(attrs).exec(function (err, model) {
          activity = model;
          done(err);
        });
      });

      it('should return 200', function (done) {
        var startDate = urlencode(moment().utc().subtract(1, 'hours').format());
        request(sails.hooks.http.app)
          .get('/api/activities?start_date=' + startDate)
          .set('Authorization', 'Bearer ' + accessToken.access_token)
          .expect(200, done);
      });

      it('should return the correct JSON', function (done) {
        var expectedJSON = [factory.build('/api/activities', {
          'timestamp': activity.timestamp.toJSON()
        })];

        var startDate = urlencode(moment().utc().subtract(1, 'hours').format());
        request(sails.hooks.http.app)
          .get('/api/activities?start_date=' + startDate)
          .set('Authorization', 'Bearer ' + accessToken.access_token)
          .expect(expectedJSON, done);
      });
    });

  });

});
