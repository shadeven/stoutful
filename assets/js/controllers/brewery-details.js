angular.module('stoutful.controllers').
  controller('BreweryDetailsController', function($scope, $routeParams, $http, rx, $modal, session) {
    var breweryId = $routeParams.breweryId;
    $scope.showAlert = session.isLoggedIn();
    $scope.placeholder = '/images/placeholder.jpg';

    $scope.editBrewery = function() {
      $modal.open({
        templateUrl: 'partials/edit-brewery.html',
        controller: 'EditBreweryCtrl',
        windowClass: 'brewery-details',
        resolve: {
          brewery: function() {
            return $scope.brewery;
          }
        }
      });
    };

    // Main

    // Watch for session user change
    $scope.$watch(function() { return session.user; }, function() {
      $scope.user = session.user;
      $scope.showAlert = session.isLoggedIn();
    });

    // Fetch brewery
    $http.get('/api/breweries/' + breweryId)
      .then(function(response) {
        $scope.brewery = response.data;
      })
      .catch(function(err) {
        console.log(err);
      });
  });
