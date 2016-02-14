/* empty directive */

(function() {
  "use strict";

  angular
    .module("stoutful.directives")
    .directive("empty", empty);

  function empty() {
    return {
      restrict: "E",
      scope: {
        title: "=",
        message: "="
      },
      templateUrl: "partials/empty.html"
    };
  }

})();
