var ES = require("elasticsearch");
var ElasticsearchModel = require("./elasticsearch/model");

var client = createClient();

function ElasticsearchService() {
  var self = this;
  this.initialize = function() {
    Object.keys(sails.models).forEach(function(name) {
      var model = sails.models[name];
      if (model.elasticsearch) {
        var model = new ElasticsearchModel(client, name, model.elasticsearch.index);
        Object.defineProperty(self, name, {value: model});
      }
    });
  };

  this.search = function(options) {
    sanatizeOptions(options);
    return client.search(options);
  }

  function sanatizeOptions(options) {
    if (!options.index) {
      options.index = "stoutful";
    }
  }
}

function createClient() {
  var config = sails.config.connections.elasticsearch;
  return new ES.Client({
    host: config.host + ":" + (config.port || "9200"),
    log: config.log
  });
}

module.exports = new ElasticsearchService();
