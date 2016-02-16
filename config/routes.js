/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */
 /* global sails */

module.exports.routes = {
  '/*': function(req, res, next) {
    sails.log.verbose(req.method, req.url); next();
  },

  '/': {
    view: 'index'
  },

  'post /oauth/token': 'AuthController.token',
  'post /auth/:provider': 'AuthController.provider',
  'post /login/:provider': 'AuthController.login',
  'get /logout': 'AuthController.logout',

  // Activities
  'get /api/activities': 'ActivityController.find',
  'post /api/users/activity': 'ActivityController.create',

  // User
  'get /api/users/me': 'UserController.me',
  'post /api/users/create': 'UserController.create',
  'get /api/users/:id': 'UserController.findOne',

  // Beers
  'get /api/beers/suggestions/:id': 'BeerController.suggestions',
  'get /api/beers/search': 'BeerController.search',
  'get /api/beers/popular': 'BeerController.popular',
  'get /api/beers/:id': 'BeerController.findOne',
  'get /api/beers/:id/stats': 'BeerController.stats',
  'put /api/beers/:id': 'BeerController.update',

  // Breweries
  'get /api/breweries/search': 'BreweryController.search',
  'get /api/breweries/:id': 'BreweryController.findOne',
  'put /api/breweries/:id': 'BreweryController.update',

  // Patches
  'get /api/patches': 'PatchController.find',
  'get /api/patches/:id': 'PatchController.findOne',
  'delete /api/patches/:id': 'PatchController.destroy',

  // Categories
  'get /api/categories': 'CategoryController.find'
};
