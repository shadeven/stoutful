/* Google Sign In button directive */

(function() {
  "use strict";

  angular
    .module("stoutful.directives")
    .directive("gSignin", gSignin);

  function gSignin() {
    return {
      restrict: "E",
      scope: {
        onsuccess: "=",
        onfailure: "="
      },
      template: "<div id='g-signin'></div>",
      replace: true,
      link: function(scope, element, attrs) {
        gapi.signin2.render(attrs.id, {
          "onsuccess": scope.onsuccess,
          "onfailure": scope.onfailure
        });
      }
    };
  }
})();
