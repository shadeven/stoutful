/* ng-background-image directive */

(function() {
  "use strict";

  angular
    .module("stoutful.directives")
    .directive("ngBackgroundImage", ngBackgroundImage);

  function ngBackgroundImage() {
    return {
      restrict: "A",
      replace: true,
      link: function(scope, elem, attr) {
        if (attr.ngModel) {
          scope.$watch(attr.ngModel, function(newValue) {
            if (!newValue) return;
            elem.css("background-image", "url(\"" + newValue + "\")");
          });
        }

        if (attr.ngBackgroundImage) {
          elem.css("background-image", "url(\"" + attr.ngBackgroundImage + "\")");
          attr.$set("ngBackgroundImage", null);
        }
      }
    };
  }

})();
