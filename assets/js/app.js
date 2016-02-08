var app = angular.module('stoutful', ['ngRoute', 'stoutful.controllers', 'stoutful.directives', 'stoutful.services']);

app.run(function(formlyConfig, $rootScope, session, $location) {

  // Formly config

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

  // Route policies

  $rootScope.$on('$routeChangeStart', function(event, next) {
    var nextController = next.$$route.controller;
    var authenticated = session.isLoggedIn();

    $rootScope.showNavBar = nextController !== 'SplashController';

    if (!authenticated && next.requiresAuth) {
      console.log('Not authenticated, redirecting back to /');
      $location.path('/'); // For now, just return to the home page
    }
  });

});

app.config(function ($controllerProvider, $httpProvider, $routeProvider) {
  /* Configure routes */

  $routeProvider.when('/', {
    templateUrl: 'partials/splash.html',
    controller: 'SplashController',
  })
  .when('/home', {
    templateUrl: 'partials/home.html',
    controller: 'HomeController',
    requiresAuth: true
  })
  .when('/profile', {
    templateUrl: 'partials/profile.html',
    controller: 'ProfileController',
    requiresAuth: true
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
    controller: 'PatchController',
    controllerAs: "vm",
    requiresAuth: true
  })
  .when('/patches/:patchId', {
    templateUrl: 'partials/patch-details.html',
    controller: 'PatchDetailsController',
    controllerAs: "vm",
    requiresAuth: true
  });
});
