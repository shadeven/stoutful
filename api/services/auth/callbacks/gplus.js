/* global User, AccessToken, RefreshToken, UserIdentity */
var Promise = require('bluebird');

module.exports = function(tokens, profile, done) {
  // Check if we have a user with the same email address
  var email = profile.email;
  var accessToken = tokens.access_token;

  User.findOne({ email: email })
    .then(function(result) {
      if (result) {
        // Existing user
        handleExistingUser(result, done);
      } else {
        // New user here, let create them an account
        handleNewUser(accessToken, profile, done);
      }
    })
    .catch(function(err) {
      console.log('Error finding user with email: ', err);
      done(err);
    });
};

function handleExistingUser(user, done) {
  AccessToken.findOne({user_id: user.id})
    .then(function(accessToken) {
      if (accessToken) {
        var result = accessToken.toJSON();
        done(null, user, result);
      } else {
        done(new Error('Access token not found'), null, null);
      }
    })
    .catch(done);
}

/**
 * Registers this user as a new user in our system
 */
function handleNewUser(accessToken, profile, done) {
  var user = {
    first_name: profile.name.givenName,
    last_name: profile.name.familyName,
    image_url: profile.image.url,
    email: profile.email,
    password: 'ademopassword',
  };

  User.create(user)
    .then(function(user) {
      if (user) {
        // Create a user identity
        var identity = {
          user_id: user.id,
          provider_id: profile.id,
          provider: 'google'
        };
        UserIdentity.create(identity)
          .then(function() {
            // Generate an access token and refresh token
            Promise.all([AccessToken.generateAndSave(user.id), RefreshToken.generateAndSave(user.id)])
              .then(function (values) {
                var accessToken = values[0];
                var refreshToken = values[1];
                var result = accessToken.toJSON();
                result.refresh_token = refreshToken.token;
                done(null, user, result);
              })
              .catch(done);
          })
          .catch(done);
      } else {
        // Something wrong happened.
        done(new Error('Unable to create user'));
      }
    })
    .catch(function(err) {
      console.log('Error creating user: ', err);
      done(err);
    });
}
