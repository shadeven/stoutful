angular.module('stoutful.controllers').
  controller('ProfileController', function($scope, $http, session) {
    $scope.user = session.user;

    // Watch for session user change
    $scope.$watch(function() { return session.user; }, function() {
      $scope.user = session.user;
    });

    $scope.actionVerbForActivityType = function(type) {
      if (type === 'like') {
        return 'Liked';
      }

      if (type === 'drink') {
        return 'Drank';
      }

      return null;
    };

    // Fetch user activities
    $http.get('/api/activities')
      .then(function(response) {
        $scope.activities = response.data;
      })
      .catch(function(err) {
        console.log(err);
      });
  });
