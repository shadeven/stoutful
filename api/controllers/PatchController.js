/**
 * PatchController
 *
 * @description :: Server-side logic for managing patches
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 /* global Patch */

module.exports = {
  find: function(req, res) {
    var user = req.user;
    if (!user) return res.unAuthorized();

    // Collect query params
    var query = req.query;

    // Run query
    Patch.find(query).populate('editor')
      .then(function(patches) {
        res.ok(patches);
      })
      .catch(function(err) {
        res.serverError(err);
      });
  }
};
