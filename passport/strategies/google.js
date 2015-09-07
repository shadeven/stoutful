var googleapis = require('googleapis');
var clientIds = {
  'web': '1068487601849-a0ep88imse3bn202daabmndcni4abhgl.apps.googleusercontent.com',
  'android': '1068487601849-vbbdff12g4mo0sjgeb333icg7u2o9dfm.apps.googleusercontent.com'
};

var Strategy = function(options, callback) {
  this.name = 'google';
  this.callback = callback;
};

Strategy.prototype.authenticate = function(req) {
  var self = this;
  var accessToken = req.body.access_token;
  var oauth2 = googleapis.oauth2('v2');

  var done = function(err, user, tokens) {
    if (err) { return self.error(err); }
    if (!user) { return self.fail(tokens); }
    self.success(user, tokens);
  };

  // Verify access token
  oauth2.tokeninfo({access_token: accessToken}, function(err, data) {
    if (err) {
      return done(err);
    }

    // Verify audience
    var audience = data.audience;
    if (audience == clientIds.web || audience == clientIds.android) {
      // OK! Lets build the user profile
      var profile = {
        id: data.user_id,
        email: data.email
      };

      // Fetch Google profile
      var plus = googleapis.plus('v1');
      var auth = new googleapis.auth.OAuth2(audience);
      auth.setCredentials({access_token: accessToken});
      plus.people.get({userId: 'me', auth: auth}, function(err, gProfile) {
        if (err) {
          return done(err);
        }

        profile.name = gProfile.name;
        profile.image = gProfile.image;

        // Verify with Stoutful
        self.callback({access_token: accessToken}, profile, done);
      });
    }

  });
};

module.exports = Strategy;
