/**
 * PatchController
 *
 * @description :: Server-side logic for managing patches
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 /* global Patch, Beer, Brewery */

var moment = require('moment');

module.exports = {
  find: function(req, res) {
    // Collect query params
    var query = req.query;

    // Exclude deleted patches
    query.deleted_at = null;

    // Run query
    Patch.find(query).populate('editor')
      .then(function(patches) {
        res.ok(patches);
      })
      .catch(function(err) {
        res.serverError(err);
      });
  },
  destroy: function(req, res) {
    var id = req.params.id;
    Patch.findOne(id)
      .then(function(patch) {
        var model = modelFromType(patch.type);
        if (model) {
          return model.update(patch.model, patch.changes);
        }
      })
      .then(function() {
        return Patch.update(id, {deleted_at: moment().toDate()});
      })
      .then(function() {
        res.ok();
      })
      .catch(function(err) {
        console.log('Error updating model: ', err);
        res.serverError(err);
      });
  }
};

function modelFromType(type) {
  if (type === 'beer') return Beer;
  if (type === 'brewery') return Brewery;
  return undefined;
}
