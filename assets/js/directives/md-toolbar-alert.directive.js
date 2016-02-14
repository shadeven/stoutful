(function() {
  "use strict";

  angular
    .module("stoutful.directives")
    .directive("mdToolbarAlert", mdToolbarAlert);

  function mdToolbarAlert() {
    var directiveDefinitionObject = {
      restrict: "E",
      compile: function(elem, attrs) {
        var $elem = $(elem);
        var contentHtml = $elem.html(); // Save contents for later
        $elem.empty(); // Empty contents

        // Define components

        var $content = $("<span></span>")
          .append(contentHtml);

        var $spacer = $("<span class='flex'></span>");

        var $dismiss = $("<md-button class='md-icon-button'></md-button>")
          .attr("ng-click", attrs.mdToolbarAlertDismiss)
          .append("<md-icon>close</md-icon>");

        // Tie components together

        var $tools = $("<div></div>")
          .addClass("md-toolbar-tools")
          .append($content)
          .append($spacer)
          .append($dismiss);

        var $toolbar = $("<md-toolbar></md-toolbar>")
          .append($tools)
          .addClass("alert-" + attrs.alert);

        // Finally, add toolbar to DOM

        $elem.append($toolbar);

        // Clean up

        $elem.removeAttr("md-toolbar-alert-dismiss");
      }
    };

    return directiveDefinitionObject;
  }
})();
