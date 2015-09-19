angular.module('stoutful.controllers').
  controller('ProfileController', function($scope, session) {
    $scope.user = session.user;
    console.log('user = ', session.user);
  });
