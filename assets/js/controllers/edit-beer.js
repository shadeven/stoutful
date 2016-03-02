angular.module('stoutful.controllers').
  controller('EditBeerCtrl', function ($scope, $mdDialog, $http, Upload, beer, session) {
    var vm = this;

    vm.beer = beer;
    vm.image = vm.beer.image_url;
    vm.selectedBrewery = beer.brewery;
    vm.changedAttributes = {};
    vm.loading = false;
    vm.isLoggedIn = session.isLoggedIn();

    vm.close = close;
    vm.save = save;
    vm.searchBrewery = searchBrewery;
    vm.onSelect = onSelect;
    vm.attachImage = attachImage;

    watchForChanges();

    ////////////////////////////////////////////////////////////////////////////

    function watchForChanges() {
      // Although Angular handles 2-way data binding for us, below is for recording which
      // attributes were changed so when it comes time to PUT, we only PUT the attributes
      // that were changed instead of all attributes.
      var watchAttributes = ['name', 'abv', 'ibu', 'description', 'brewery'];
      watchAttributes.forEach(function(attribute) {
        $scope.$watch(function() { return vm.beer[attribute]; }, function(newValue, oldValue) {
          if (_.isEqual(newValue, oldValue) || !newValue) return; // Invalid states, ignore

          console.log(attribute + ' has been changed.');
          if (attribute === 'brewery') {
            vm.changedAttributes.brewery_id = newValue.id;
          } else {
            vm.changedAttributes[attribute] = newValue;
          }
        });
      });
    }

    function close() {
      $mdDialog.hide();
    };

    function save() {
      if (!vm.editForm.$valid) return;

      var req = {
        url: '/api/beers/' + beer.id,
        method: 'PUT',
        fields: vm.changedAttributes
      };

      if (vm.image) {
        req.file = vm.image;
      }

      vm.loading = true;
      Upload.upload(req)
        .then(function() {
          // Handle success
          vm.loading = false;
          $mdDialog.hide();
        }, function(resp) {
          // Handle error
          vm.loading = false;
          $mdDialog.hide();
          if (resp.status == 304) {
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
          } else {
            console.log('Err = ', resp);
          }
        });
    };

    function searchBrewery(value) {
      return $http.get('/api/breweries/search?query=' + value)
        .then(function(response) {
          return response.data;
        });
    };

    // We use a custom onSelect function because the "model" ends up being the name
    // and not the actual model.
    function onSelect(brewery) {
      if (!brewery) return;
      vm.beer.brewery = brewery;
    };

    function attachImage() {
      $("input[type=file]").click();
    };
  });
