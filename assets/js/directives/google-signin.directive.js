/* Google Sign In button directive */

(function() {
  "use strict";

  angular
    .module("stoutful.directives")
    .directive("googleSignin", googleSignin);

  function googleSignin() {
    return {
      restrict: "E",
      scope: {
        onsuccess: "=",
        onfailure: "="
      },
      template: "<div id='google-signin'></div>",
      replace: true,
      link: function(scope, element, attrs) {
        var width = $(element).width() || 120;
        gapi.signin2.render(attrs.id, {
          "onsuccess": scope.onsuccess,
          "onfailure": scope.onfailure,
          "width": width,
          "longtitle": true
        });
      }
    };
  }
})();
