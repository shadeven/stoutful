module.exports.passport = {
  google: {
    strategy: require('passport-google-plus'),
    callback: require('../api/services/auth/callbacks/gplus'),
    options: {
      clientId: '1068487601849-vbbdff12g4mo0sjgeb333icg7u2o9dfm.apps.googleusercontent.com'
    }
  }
};
