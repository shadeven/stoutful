var moment = require('moment');

module.exports = function (factory) {
  factory.define("beer")
    .attr("id", 1)
    .attr("brewery_id", 1)
    .attr("name", "Sample beer")
    .attr("cat_id", 1)
    .attr("style_id", 1)
    .attr("abv", 0)
    .attr("ibu", 0)
    .attr("srm", 0)
    .attr("upc", 0)
    .attr("image_url", "http://placehold.it/300x300")
    .attr("description", "lorem ipsum")
    .attr("created_at", moment().utc().toDate().toJSON())
    .attr("updated_at", moment().utc().toDate().toJSON());
};
