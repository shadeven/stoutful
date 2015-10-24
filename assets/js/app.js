var app = angular.module('stoutful', ['ngRoute', 'stoutful.controllers', 'stoutful.directives', 'stoutful.services']);

app.run(function(formlyConfig) {
  formlyConfig.setType([{
    name: 'input',
    templateUrl: 'partials/formly/input.html',
    overwriteOk: true
  }, {
    name: 'brewery-input',
    templateUrl: 'partials/formly/brewery-input.html',
    overwriteOk: true
  }, {
    name: 'category-input',
    templateUrl: 'partials/formly/category-input.html',
    overwriteOk: true
  }, {
    name: 'style-input',
    templateUrl: 'partials/formly/style-input.html',
    overwriteOk: true
  }, {
    name: 'image',
    templateUrl: 'partials/formly/image.html',
    overwriteOk: true
  }, {
    name: 'textarea',
    templateUrl: 'partials/formly/textarea.html',
    overwriteOk: true
  }]);
});

app.config(function ($controllerProvider, $httpProvider, $routeProvider) {
  /* Configure routes */

  $routeProvider.when('/', {
    templateUrl: 'partials/search.html',
    controller: 'SearchController'
  })
  .when('/profile', {
    templateUrl: 'partials/profile.html',
    controller: 'ProfileController'
  })
  .when('/beer/:beerId', {
    templateUrl: 'partials/beer-details.html',
    controller: 'BeerDetailsController'
  })
  .when('/brewery/:breweryId', {
    templateUrl: 'partials/brewery-details.html',
    controller: 'BreweryDetailsController'
  })
  .when('/patches', {
    templateUrl: 'partials/patch.html',
    controller: 'PatchController'
  })
  .when('/patches/:patchId', {
    templateUrl: 'partials/patch-details.html',
    controller: 'PatchDetailsController'
  });
});
