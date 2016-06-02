/* RegisterController */

(function() {
  "use strict";

  angular
    .module("stoutful.controllers")
    .controller("RegisterController", RegisterController);

  function RegisterController($scope) {
    $scope.formHolder = {};
    $scope.onRegisterClicked = onRegisterClicked;
    $scope.dismiss = dismiss;
    $scope.dismissToolbarAlert = dismissToolbarAlert;

    ////////////////////////////////////////////////////////////////////////////

    function onRegisterClicked() {
      var form = {
        first_name: $scope.formHolder.firstName,
        last_name: $scope.formHolder.lastName,
        email: $scope.formHolder.email,
        password: $scope.formHolder.password
      };

      $scope.vm.register(form);
    }

    function dismiss() {
      $scope.vm.showRegister = false;
    }

    function dismissToolbarAlert() {
      $scope.vm.error = null;
    }
  }
})();
