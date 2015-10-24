angular.module('stoutful.controllers').
  controller('NavBarController', function($scope, $modal, $http, session, $window) {
    var auth2;
    gapi.load('auth2', function() {
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      auth2 = gapi.auth2.init({
        client_id: '1068487601849-a0ep88imse3bn202daabmndcni4abhgl.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'https://www.googleapis.com/auth/plus.login email'
      });

      $http({ method: 'GET', url: '/api/users/me' })
        .then(function(response) {
          $scope.user = session.user = response.data;
          $scope.userName = $scope.user.first_name + ' ' + $scope.user.last_name;
        })
        .catch(function(err) {
          console.log(err);
        });
    });

    // Watch for session user change
    $scope.$watch(function() { return session.user; }, function() {
      $scope.user = session.user;
      if ($scope.user) {
        $scope.userName = $scope.user.first_name + ' ' + $scope.user.last_name;
      }
    });

    $scope.openLogin = function() {
      $modal.open({
        templateUrl: 'partials/login.html',
        controller: 'LoginController',
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
        templateUrl: 'partials/login.html',
        controller: 'LoginController',
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
