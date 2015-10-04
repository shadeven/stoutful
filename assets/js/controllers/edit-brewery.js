angular.module('stoutful.controllers').
  controller('EditBreweryCtrl', function ($scope, $modalInstance, $http, Upload, brewery, session) {
    $scope.brewery = brewery;
    $scope.image = $scope.brewery.image_url;
    $scope.isLoggedIn = session.isLoggedIn();

    // Although Angular handles 2-way data binding for us, below is for recording which
    // attributes were changed so when it comes time to PUT, we only PUT the attributes
    // that were changed instead of all attributes.
    var watchAttributes = ['name', 'address1', 'address2', 'city', 'state', 'phone', 'website',
      'description'];
    var changedAttributes = {};
    watchAttributes.forEach(function(attribute) {
      $scope.$watch(function() { return $scope.brewery[attribute]; }, function(newValue, oldValue) {
        if (_.isEqual(newValue, oldValue) || !newValue) return; // Invalid states, ignore

        console.log(attribute + ' has been changed.');
        changedAttributes[attribute] = newValue;
      });
    });

    $scope.close = function() {
      $modalInstance.close();
    };

    $scope.save = function() {
      if (!$scope.editForm.$valid) return;

      var req = {
        url: '/api/breweries/' + brewery.id,
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
          $modalInstance.close();
        })
        .error(function(err) {
          console.log('Err = ', err);
        });
    };
  });
