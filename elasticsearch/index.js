var config = require('../config');
var elasticsearch = require('elasticsearch');

module.exports = new elasticsearch.Client(config.elasticsearch);
