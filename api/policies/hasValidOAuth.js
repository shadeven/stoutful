/* global Passport */

module.exports = Passport.authenticate(["oauth2-client-password", "anonymous"], {session: false});
