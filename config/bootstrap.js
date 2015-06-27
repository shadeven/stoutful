/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

  if (sails.config.environment === 'development') {
    var localtunnel = require('localtunnel');
    localtunnel(sails.config.port, {subdomain: 'stoutful'}, function(err, tunnel) {
      if (err) {
        return console.log('Error starting localtunnel: ', err);
      }

      console.log('Tunnel has started at ' + tunnel.url);
      cb();
    });
  } else {
    cb();
  }
};
