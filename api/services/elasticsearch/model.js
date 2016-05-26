function ElasticsearchModel(client, name, fields) {
  var client = client;
  var name = name;
  var fields = fields;

  this.update = function(model) {
    var doc = {};

    fields.forEach(function(field) {
      doc[field] = model[field];
    });

    client.update({
      index: "stoutful",
      type: name,
      id: model.id,
      body: {
        doc: doc
      }
    })
  };
}

module.exports = ElasticsearchModel;
