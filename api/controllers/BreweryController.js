/**
 * BreweriesController
 *
 * @description :: Server-side logic for managing breweries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var path = require("path");
var actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
var Promise = require("bluebird");
var _ = require("underscore");

module.exports = {
  update: function(req, res) {
    // Do we have a user?
    var user = req.user;
    if (!user) return res.unAuthorized();

    var file = req.file('file');
    file.upload(sails.config.skipper, function(err, uploadedFiles) {
      if (err) {
        console.log('Error uploading files: ', err);
      } else {
        if (uploadedFiles.length > 0) {
          var file = uploadedFiles[0];
          if (file.fd) {
            req.body.image_url = path.relative("/app/dist", file.fd);
          }
          if (file.extra && file.extra.Location) {
            req.body.image_url = file.extra.Location;
          }
        }
      }

      var values = actionUtil.parseValues(req);
      var id = req.params.id;

      // If user is an editor, we save changes to the "staging" db for review
      if (user.isEditor()) {
        Patch.create({editor: user.id, model: id, type: 'brewery', changes: values})
          .then(function() {
            res.notModified();
          })
          .catch(function(err) {
            console.log('Error saving brewery patch: ', err);
            res.serverError(err);
          });
        return;
      }

      Brewery.update(id, values)
        .then(function(breweries) {
          var brewery = breweries[0];
          if (!brewery) return res.serverError('Could not find record after updating!');
          return Brewery.findOne(brewery.id).populateAll();
       })
      .then(function(brewery) {
        res.ok(brewery);
      })
      .catch(function(err) {
        res.serverError(err);
      });
    });
  }
};
