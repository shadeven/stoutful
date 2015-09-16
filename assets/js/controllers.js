angular.module('stoutful.controllers', ['ui.bootstrap', 'ngFileUpload', 'oc.lazyLoad', 'ngCookies', 'stoutful.directives', 'ladda']).
  controller('SearchController', function($scope, $modal, $http) {
    $scope.searchQuery = { query: '' };
    $scope.beers = [];

    $scope.isValid = function() {
      return $scope.searchQuery.query.length > 0;
    };

    $scope.performSearch = function(event) {
      var value = event.target.value;
      $http.get('/api/beers/search?query=' + value)
        .then(function (data) {
          $scope.beers = data.data;
        })
        .catch(function (err) {
          console.log('Err = ', err);
        });
    };

    $scope.open = function (beer) {
      $modal.open({
        templateUrl: 'partials/edit-beer.html',
        controller: 'EditBeerCtrl',
        windowClass: 'beer-details',
        resolve: {
          beer: function() {
            return beer;
          }
        }
      });
    };
  }).
  controller('EditBeerCtrl', function ($scope, $modalInstance, $http, Upload, beer) {
    $scope.beer = beer;
    $scope.image = $scope.beer.image_url;
    $scope.selectedBrewery = beer.brewery;
    $scope.loading = false;

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
      $modalInstance.close();
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
        $modalInstance.close();
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
    $scope.onSelect = function($item) {
      $scope.beer.brewery = $item;
    };
  }).
  controller('LoginController', function($scope, $http, $ocLazyLoad, $window, session) {
    $scope.renderButton = function() {
      gapi.signin2.render('g-signin2', {
        'scope': 'https://www.googleapis.com/auth/plus.login email',
        'width': 220,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': $scope.onSuccess,
        'onfailure': $scope.onFailure
      });
    };

    $ocLazyLoad.load('https://apis.google.com/js/platform.js')
      .then(function() {
        $scope.renderButton();
      });

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
          // Store access token and navigate to search page.
          $window.location.href= '/#/profile';
        })
        .catch(function(err) {
          console.log('Error logging in: ', err);
          if (err.status == 401) {
            googleUser.disconnect();
          }
        });
    };

    $scope.onFailure = function() {
      // TODO
    };
  }).
  controller('ProfileController', function($scope, session) {
    $scope.user = session.user;
    console.log('user = ', session.user);
  });
