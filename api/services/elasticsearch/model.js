function ElasticsearchModel(client, name, fields) {
  var client = client;
  var name = name;
  var fields = fields;

  this.update = function(model) {
    var doc = createDocument(model, fields);
    return client.update({
      index: "stoutful",
      type: name,
      id: model.id,
      body: {
        doc: doc
      }
    });
  };

  this.bulk = function(models) {
    var body = [];

    models.forEach(function(model) {
      var action = { index: { _index: "stoutful", _type: name, _id: model.id } };
      var document = createDocument(model, fields);
      body.push(action);
      body.push(document);
    });

    return client.bulk({body: body});
  };

  function createDocument(model, fields) {
    return fields.reduce(function(obj, field) {
      obj[field] = model[field];
      return obj;
    }, {});
  }
}

module.exports = ElasticsearchModel;
