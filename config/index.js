var env = process.env.NODE_ENV || 'development';

var config;
if (env == 'development') {
  config = require('./development');
}

module.exports = config;
