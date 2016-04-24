(function() {
  'use strict';

  angular
    .module('stoutful.controllers')
    .controller('NavBarController', NavBarController);

  function NavBarController($scope, $http, session, $window, $location, toolbar) {

    $scope.logout = logout;
    $scope.onClickMyProfile = onClickMyProfile;
    $scope.navigateBack = navigateBack;
    $scope.toolbar = toolbar;

    if (shouldShowNavBar()) {
      if (session.user) {
        $scope.user = session.user;
        $scope.userName = $scope.user.first_name + ' ' + $scope.user.last_name;
      }

      watchForUserChange();
      watchForUrlChange();
    }

    ////////////////////////////////////////////////////////////////////////////

    function shouldShowNavBar() {
      return $location.url() !== '/';
    }

    function logout() {
      $http({ method: 'GET', url: '/logout' })
        .then(function() {
          session.destroy();
          $location.url('/');
        })
        .catch(function(err) {
          console.log('Error logging out: ', err);
        });
    }

    function onClickMyProfile() {
      $window.location.href = '/#/profile';
    }

    function watchForUserChange() {
      var target = function() {
        return $scope.user;
      };

      var listener = function() {
        $scope.user = session.user;
        if ($scope.user) {
          $scope.userName = $scope.user.first_name + ' ' + $scope.user.last_name;
        }
      };

      $scope.$watch(target, listener);
    }

    function watchForUrlChange() {
      var target = function() {
        return $location.url();
      };

      var listener = function() {
        $scope.atHome = $location.url() == '/home';
      };

      $scope.$watch(target, listener);
    }

    function navigateBack() {
      $window.history.back();
    }
  }
})();
