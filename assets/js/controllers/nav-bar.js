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

    $scope.openLogin = function() {
      $modal.open({
        templateUrl: 'partials/login-modal.html',
        controller: 'ModalLoginController',
        windowClass: 'login',
        resolve: {
          title: function() {
            return 'Log In';
          },
          contentTemplate: function() {
            return 'partials/provider-login.html';
          },
          legacyTemplate: function() {
            return 'partials/legacy-login.html';
          }
        }
      });
    };

    $scope.openSignup = function() {
      $modal.open({
        templateUrl: 'partials/login-modal.html',
        controller: 'ModalLoginController',
        windowClass: 'login',
        resolve: {
          title: function() {
            return 'Sign Up';
          },
          contentTemplate: function() {
            return 'partials/provider-signup.html';
          },
          legacyTemplate: function() {
            return 'partials/legacy-signup.html';
          },
          legacyText: function() {
            return 'Sign up with email and password';
          }
        }
      });
    };

    $scope.logout = function() {
      $http({method: 'GET', url: '/logout'}).
        then(function() {
          var auth2 = gapi.auth2.getAuthInstance();
          return auth2.signOut();
        }).
        then(function() {
          session.destroy();
        }).
        catch(function(err) {
          console.log('Error logging out: ', err);
        });
    };

    $scope.onClickMyProfile = function() {
      $window.location.href = '/#/profile';
    };
  });
