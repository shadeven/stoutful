angular.module('stoutful.controllers').
  controller('SplashController', function($scope) {
    $scope.loginPartial = 'partials/login.html';
    $scope.showLoginPartial = function() {
      $scope.showLogin = true;
    }
  });
