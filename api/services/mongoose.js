var mongoose = require('mongoose');
mongoose.connect('mongodb://' + sails.config.connections.mongo.host + '/stoutful');
module.exports = mongoose;
