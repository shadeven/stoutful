angular.module('stoutful.controllers').
  controller('LoginController', function($scope, $modalInstance, $http, $ocLazyLoad, $window, session) {
    var auth2 = gapi.auth2.getAuthInstance();

    $scope.signIn = function() {
      auth2.signIn().then($scope.onSuccess, $scope.onFailure);
    };

    $scope.onSuccess = function(googleUser) {
      var authResponse = googleUser.getAuthResponse();
      var accessToken = authResponse.access_token;

      var req = {
        method: 'POST',
        url: '/login/google'
      };

      if (accessToken) {
        req.data = {'access_token': accessToken};
      }

      $http(req)
        .then(function() {
          // Fetch user data
          return $http({ method: 'GET', url: '/api/users/me' });
        })
        .then(function(response) {
          session.user = response.data;
          $modalInstance.close();
        })
        .catch(function(err) {
          console.log('Error logging in: ', err);
          if (err.status == 401) {
            auth2.signOut()
              .then(function() {
                console.log('signed out.');
              });
          }
        });
    };

    $scope.onFailure = function(err) {
      console.log(err);
    };
  });
