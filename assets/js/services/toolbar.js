/* Toolbar service */

(function() {
  "use strict";

  angular
    .module("stoutful.services")
    .service("toolbar", toolbar);

  function toolbar() {
    return {
      icon: null,
      events: {
        onIconClicked: function() {/* No op */}
      }
    };
  }

})();
