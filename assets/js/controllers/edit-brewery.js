angular.module('stoutful.controllers').
  controller('EditBreweryCtrl', function ($scope, $mdDialog, $http, Upload, brewery, session, $modal) {
    var vm = this;
    vm.brewery = brewery;
    vm.image = vm.brewery.image_url;
    vm.isLoggedIn = session.isLoggedIn();

    // Although Angular handles 2-way data binding for us, below is for recording which
    // attributes were changed so when it comes time to PUT, we only PUT the attributes
    // that were changed instead of all attributes.
    var watchAttributes = ['name', 'address1', 'address2', 'city', 'state', 'phone', 'website',
      'description'];
    var changedAttributes = {};
    watchAttributes.forEach(function(attribute) {
      $scope.$watch(function() { return vm.brewery[attribute]; }, function(newValue, oldValue) {
        if (_.isEqual(newValue, oldValue) || !newValue) return; // Invalid states, ignore

        console.log(attribute + ' has been changed.');
        changedAttributes[attribute] = newValue;
      });
    });

    vm.close = function() {
      $mdDialog.hide();
    };

    vm.save = function() {
      if (!vm.editForm.$valid) return;

      var req = {
        url: '/api/breweries/' + brewery.id,
        method: 'PUT',
        fields: changedAttributes
      };

      if (vm.image) {
        req.file = vm.image;
      }

      vm.loading = true;
      Upload.upload(req)
        .success(function() {
          vm.loading = false;
          $mdDialog.hide();

          // Show alert message
          $modal.open({
            templateUrl: 'partials/alert.html',
            controller: 'AlertCtrl',
            resolve: {
              title: function() {
                return 'Thanks!';
              },
              message: function() {
                return 'Your changes are currently under review';
              }
            }
          });
        })
        .error(function(err) {
          console.log('Err = ', err);
        });
    };

    vm.attachImage = function() {
      $("input[type=file]").click();
    };
  });
