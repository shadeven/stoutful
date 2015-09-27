angular.module('stoutful.controllers').
  controller('LoginController', function($scope, $modalInstance, title, contentTemplate, legacyTemplate) {
    $scope.modalInstance = $modalInstance;
    $scope.title = title;
    $scope.contentTemplate = contentTemplate;
    $scope.legacyTemplate = legacyTemplate;

    $scope.showLegacyForm = function(showLegacy) {
      $scope.legacy = showLegacy;
    };
  });
