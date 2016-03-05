/* global User, Activity */

var Promise = require('bluebird');
var request = require('supertest');
var moment = require('moment');
var urlencode = require('urlencode');
var factory = require('sails-factory');
var Barrels = require('barrels');
var helpers = require('../../helpers/user');

describe('ActivityController', function () {

  before(function (done) {
    factory.load();
    var barrels = new Barrels();
    barrels.populate(function (err) {
      done(err);
    }, false);
  });

  describe('#find()', function () {
    var accessToken;
    var john, stannis;

    before(function (done) {
      Promise.all([User.findOne({"email": "jsnow283@gmail.com"}), User.findOne({"email": "stannisb@gmail.com"})])
        .then(function(users) {
          john = users[0];
          stannis = users[1];
          helpers.signIn(john, function (err, token) {
            accessToken = token;
            done(err);
          });
        })
        .catch(done);
    });

    context('with signed in user', function() {
      var activities;

      before(function (done) {
        var attrs1 = factory.build('activity', {"id": 1, "type": "check_in", "user": john.id});
        var attrs2 = factory.build('activity', {"id": 2, "type": "check_in", "user": stannis.id});

        Activity.create([attrs1, attrs2]).exec(function (err, models) {
          activities = models;
          done(err);
        });
      });

      after(function (done) {
        Activity.destroy().exec(done);
      });

      it('should return all activities', function (done) {
        var expectedJSON = [factory.build('/api/activities', {
          'id': 1,
          'user': john.toJSON(),
          'timestamp': activities[0].timestamp.toJSON()
        }), factory.build('/api/activities', {
          'id': 2,
          'user': stannis.toJSON(),
          'timestamp': activities[0].timestamp.toJSON()
        })];

        request(sails.hooks.http.app)
          .get('/api/activities')
          .set('Authorization', 'Bearer ' + accessToken.access_token)
          .expect(expectedJSON, done);
      });
    });

    context('with end_date parameter', function () {
      var activity;

      before(function (done) {
        var attrs = factory.build('activity', {"id": 1, "type": "check_in", "user": john.id});
        Activity.create(attrs).exec(function (err, model) {
          activity = model;
          done(err);
        });
      });

      after(function (done) {
        Activity.destroy().exec(done);
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
          'user': john.toJSON(),
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
        var attrs = factory.build('activity', {"id": 1, "type": "check_in", "user": john.id});
        Activity.create(attrs).exec(function (err, model) {
          activity = model;
          done(err);
        });
      });

      after(function (done) {
        Activity.destroy().exec(done);
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
          'user': john.toJSON(),
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
