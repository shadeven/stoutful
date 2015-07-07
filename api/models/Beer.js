/**
* Beers.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName: 'beers',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },
    brewery: {
      columnName: 'brewery_id',
      model: 'brewery',
      type: 'integer',
      notNull: true,
      required: true
    },
    name: {
      type: 'string',
      notNull: true
    },
    category: {
      columnName: 'cat_id',
      model: 'category',
      type: 'integer',
      notNull: true,
      required: true
    },
    style: {
      columnName: 'style_id',
      model: 'style',
      type: 'integer',
      notNull: true,
      required: true
    },
    abv: {
      type: 'float',
      notNull: true
    },
    ibu: {
      type: 'float',
      notNull: true
    },
    srm: {
      type: 'float',
      notNull: true
    },
    upc: {
      type: 'integer',
      notNull: true
    },
    image_url: {
      type: 'string',
      notNull: true
    },
    description: {
      type: 'string',
      notNull: true
    },
    created_at: {
      type: 'datetime',
      notNull: true,
      defaultsTo: function() {
        return new Date();
      }
    },
    updated_at: {
      type: 'datetime',
      notNull: true,
      defaultsTo: function() {
        return new Date();
      }
    },
    toJSON: function() {
      var obj = this.toObject();
      var relationships = ['brewery', 'category', 'style'];
      relationships.forEach(function (relationship) {
        if (typeof obj[relationship] !== 'object') {
          obj[relationship + '_id'] = obj[relationship];
          delete obj[relationship];
        } else if (obj[relationship].id) {
          obj[relationship + '_id'] = obj[relationship].id;
        }
      });
      return obj;
    }
  },
  search: function(query) {
    var self = this;

    return sails.services.elasticsearch.search({
      index: 'stoutful',
      body: { query: { match: { name: query } } }
    })
    .then(function (results) {
      var ids = results.hits.hits.map(function (hit) {
        return {id: parseInt(hit._id)};
      });
      return self.find(ids)
        .populate('brewery')
        .populate('category')
        .populate('style');
    });
  },
  beforeUpdate: function(values, cb) {
    values.updated_at = new Date();
    cb();
  }
};
