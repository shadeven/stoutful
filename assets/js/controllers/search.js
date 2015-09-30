angular.module('stoutful.controllers').
  controller('SearchController', function($scope, $modal, $http, rx) {
    $scope.searchQuery = { query: '' };

    $scope.isValid = function() {
      return $scope.searchQuery.query.length > 0;
    };

    $scope.performSearch = function(event) {
      var value = event.target.value;
      var searchBeers = rx.Observable.fromPromise($http.get('/api/beers/search?query=' + value));
      var searchBreweries = rx.Observable.fromPromise($http.get('/api/breweries/search?query=' + value));

      $scope.models = [];
      rx.Observable.forkJoin(searchBeers, searchBreweries)
        .flatMapLatest(function(dataArray) {
          return rx.Observable.from(dataArray);
        })
        .map(function(data) {
          return data.data;
        })
        .subscribe(
          function(data) {
            $scope.models = $scope.models.concat(data);
          },
          function(err) {
            console.log('Err = ', err);
          }
        );
    };

    $scope.open = function (model) {
      if (model.brewery) {
        $modal.open({
          templateUrl: 'partials/edit-beer.html',
          controller: 'EditBeerCtrl',
          windowClass: 'beer-details',
          resolve: {
            beer: function() {
              return model;
            }
          }
        });
      }
    };
  });
