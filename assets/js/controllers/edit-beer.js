angular.module('stoutful.controllers').
  controller('EditBeerCtrl', function ($scope, $mdDialog, $http, Upload, beer, session) {
    $scope.beer = beer;
    $scope.image = $scope.beer.image_url;
    $scope.selectedBrewery = beer.brewery;
    $scope.loading = false;
    $scope.isLoggedIn = session.isLoggedIn();

    // Although Angular handles 2-way data binding for us, below is for recording which
    // attributes were changed so when it comes time to PUT, we only PUT the attributes
    // that were changed instead of all attributes.
    var watchAttributes = ['name', 'abv', 'ibu', 'description', 'brewery'];
    var changedAttributes = {};
    watchAttributes.forEach(function(attribute) {
      $scope.$watch(function() { return $scope.beer[attribute]; }, function(newValue, oldValue) {
        if (_.isEqual(newValue, oldValue) || !newValue) return; // Invalid states, ignore

        console.log(attribute + ' has been changed.');
        if (attribute === 'brewery') {
          changedAttributes.brewery_id = newValue.id;
        } else {
          changedAttributes[attribute] = newValue;
        }
      });
    });

    $scope.close = function() {
      $mdDialog.hide();
    };

    $scope.save = function() {
      if (!$scope.editForm.$valid) return;

      var req = {
        url: '/api/beers/' + beer.id,
        method: 'PUT',
        fields: changedAttributes
      };

      if ($scope.image) {
        req.file = $scope.image;
      }

      $scope.loading = true;
      Upload.upload(req)
        .success(function() {
          $scope.loading = false;
          $mdDialog.hide();

          // Show alert message
          var alert = $mdDialog.alert({
            title: 'Thanks!',
            textContent: 'Your changes are currently under review',
            ok: 'OK'
          });

          $mdDialog
            .show(alert)
            .finally(function() {
              alert = undefined;
            });
        })
        .error(function(err) {
          console.log('Err = ', err);
        });
    };

    $scope.searchBrewery = function(value) {
      return $http.get('/api/breweries/search?query=' + value)
        .then(function(response) {
          return response.data;
        });
    };

    // We use a custom onSelect function because the "model" ends up being the name
    // and not the actual model.
    $scope.onSelect = function(brewery) {
      if (!brewery) return;
      $scope.beer.brewery = brewery;
    };

    $scope.attachImage = function() {
      $("input[type=file]").click();
    };
  });
