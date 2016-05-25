var ES = require("elasticsearch");

var config = sails.config.connections.elasticsearch;
var es = new ES.Client({
  host: config.host + ":" + (config.port || "9200"),
  log: config.log
});

function sanatizeOptions(options) {
  if (!options.index) {
    options.index = "stoutful";
  }
}

module.exports = {
  search: function(options) {
    sanatizeOptions(options);
    return es.search(options);
  }
};
