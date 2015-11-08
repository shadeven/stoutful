angular.module('stoutful.controllers').
  controller('NavBarController', function($scope, $modal, $http, session, $window, $location) {
    // Kind of a hacky way to prevent this controller from executing on the splash page
    if ($location.url() === '/') return;

    if (session.user) {
      $scope.user = session.user;
      $scope.userName = $scope.user.first_name + ' ' + $scope.user.last_name;
    }

    // Watch for session user change
    $scope.$watch(function() { return session.user; }, function() {
      $scope.user = session.user;
      if ($scope.user) {
        $scope.userName = $scope.user.first_name + ' ' + $scope.user.last_name;
      }
    });

    $scope.logout = function() {
      $http({method: 'GET', url: '/logout'})
        .then(function() {
          session.destroy();
          $location.url('/');
        })
        .catch(function(err) {
          console.log('Error logging out: ', err);
        });
    };

    $scope.onClickMyProfile = function() {
      $window.location.href = '/#/profile';
    };
  });
