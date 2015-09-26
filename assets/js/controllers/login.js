angular.module('stoutful.controllers').
  controller('LoginController', function($scope, $modalInstance) {
    $scope.modalInstance = $modalInstance;
    $scope.showLegacySignIn = function(showLegacy) {
      $scope.legacy = showLegacy;
    };
  });
