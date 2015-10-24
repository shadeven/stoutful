angular.module('stoutful.controllers').
  controller('BreweryDetailsController', function($scope, $routeParams, $http, rx, $modal, session) {
    var breweryId = $routeParams.breweryId;
    $scope.showAlert = session.isLoggedIn();

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

    // Fetch brewery
    $http.get('/api/breweries/' + breweryId)
      .then(function(response) {
        $scope.brewery = response.data;
      })
      .catch(function(err) {
        console.log(err);
      });
  });
