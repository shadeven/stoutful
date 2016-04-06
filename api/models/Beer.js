/**
* Beers.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  connection: ['pg', 'elasticsearch'],
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
      type: 'integer',
      columnName: 'brewery_id',
      notNull: true,
      model: 'brewery'
    },
    name: {
      type: 'string',
      notNull: true
    },
    category: {
      type: 'integer',
      columnName: 'cat_id',
      notNull: true,
      model: 'category'
    },
    style: {
      type: 'integer',
      columnName: 'style_id',
      notNull: true,
      model: 'style'
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
      obj.abv = parseFloat(obj.abv);
      obj.ibu = parseFloat(obj.ibu);
      obj.srm = parseFloat(obj.srm);
      return obj;
    }
  },
  beforeUpdate: function(values, cb) {
    values.updated_at = new Date();
    cb();
  },
  afterCreate: function(values, cb) {
    this.findOne({id: values.id}).populate("brewery")
      .then(function(beer) {
        values.brewery = beer.brewery;
        cb();
      })
      .catch(function(err) {
        throw err;
      });
  }
};
