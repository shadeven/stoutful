/* md-loading-container directive */

(function() {
  "use strict";

  angular
    .module("stoutful.directives")
    .directive("mdLoadingContainer", mdLoadingContainer);

  function mdLoadingContainer() {
    return {
      restrict: "E",
      link: function(scope, elem, attr) {
        var $container = $(elem);
        var progressBar = $container.find("md-progress-circular");
        progressBar.hide();
        if (attr.ngModel) {
          scope.$watch(attr.ngModel, function(newValue) {
            var children = progressBar.siblings();
            if (newValue) {
              progressBar.css("left", ($container.width() / 2) - (progressBar.width() / 2));
              progressBar.css("top", ($container.height() / 2) - (progressBar.height() / 2));
              progressBar.show();
              children.addClass("not-visible");
            } else {
              progressBar.hide();
              children.removeClass("not-visible");
            }
          });
        }
      }
    };
  }

})();
