/* Patch cache service */

(function() {
  "use strict";

  angular
    .module("stoutful.services")
    .service("patchCache", patchCache);

  function patchCache() {
    var patches = [];
    return {
      push: function(patch) {
        var existing = _.find(patches, function(item) { return item.id == patch.id;});
        if (!existing) {
          patches.push(patch);
        }
      },
      pop: function() {
        return patches.pop();
      },
      findById: function(id) {
        return _.find(patches, function(item) {
          return item.id == id;
        });
      }
    };
  }

})();
