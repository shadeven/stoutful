/* PatchController */

(function() {
  "use strict";

  angular
    .module("stoutful.controllers")
    .controller("PatchController", PatchController);

  function PatchController($http, patchCache, $location) {
    var vm = this;
    vm.emptyTitle = "Sorry!";
    vm.emptyMessage = "No patches available.";

    vm.onPatchClicked = function(patch) {
      patchCache.push(patch);
      $location.url("/patches/" + patch.id);
    };

    vm.formattedTimestamp = function(timestamp) {
      var date = moment(timestamp);
      var format;
      if (date.year() == moment().year()) {
        format = "MMMM Do";
      } else {
        format = "MMMM Do YYYY";
      }
      return date.format(format);
    };

    vm.loading = true;
    $http.get("/api/patches")
      .then(function(results) {
        vm.patches = results.data;
        vm.loading = false;
      })
      .catch(function(err) {
        console.log("Error fetching patches: ", err);
        vm.loading = false;
      });
  }
})();
