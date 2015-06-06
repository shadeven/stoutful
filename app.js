var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var StoutfulStrategy = require('./auth/strategy');

var routes = require('./routes/index');
var users = require('./routes/users');
var beers = require('./routes/beers');
var breweries = require('./routes/breweries');
var categories = require('./routes/categories');
var styles = require('./routes/styles');
var auth = require('./routes/auth');

var app = express();

var ThirdPartyId = require('./models/thirdPartyId');

passport.use(new StoutfulStrategy(function(userId, accessToken, done) {
  ThirdPartyId.where({ id: userId })
    .fetch({ withRelated: 'user' })
    .then(function(model) {
      if (model) {
        done();
      } else {
        done(new Error('User not found.'));
      }
    })
    .catch(function(err) {
      console.log('Error verifying auth: ', err);
      done(err);
    });
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// User routes
app.use('/api/users', users);
app.use(/^\/api\/users\/\d+$/, users);
app.use(/^\/api\/users\/\d+\/activities$/, users);

// Beer routes
app.use('/api/beers', beers);
app.use(/^\/api\/beers\/\d+$/, beers);
app.use('/api/beers/search', beers);
app.use('/api/beers/suggestions', beers);

// Brewery routes
app.use('/api/breweries', breweries);

app.use('/api/categories', categories);
app.use('/api/styles', styles);
app.use('/api/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
