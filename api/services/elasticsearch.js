var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client(sails.config.connections.elasticsearch);

module.exports = client;
