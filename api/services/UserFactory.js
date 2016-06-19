/* global User */

module.exports = {
  createFromGoogle: function(profile) {
    var attrs = {
      first_name: profile.name.givenName,
      last_name: profile.name.familyName,
      email: profile.emails[0].value,
      image_url: profile.photos[0].value.replace(/\?sz=\d+/, "")
    };
    return User.create(attrs);
  }
};
