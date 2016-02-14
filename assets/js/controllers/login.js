(function() {
  'use strict';

  angular
    .module('stoutful.controllers')
    .controller('LoginController', LoginController);

  function LoginController($scope) {

    $scope.formHolder = {};
    $scope.onLoginClicked = onLoginClicked;
    $scope.dismissAlert = dismissAlert;
    $scope.dismiss = dismiss;

    ////////////////////////////////////////////////////////////////////////////

    function onLoginClicked() {
      $scope.vm.login({
        email: $scope.formHolder.email,
        password: $scope.formHolder.password
      });
    }

    function dismissAlert() {
      $scope.vm.error = null;
    }

    function dismiss() {
      $scope.vm.showLogin = false;
    }
  }
}) ();
