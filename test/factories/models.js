var moment = require('moment');

module.exports = function (factory) {
  factory.define("user")
    .attr("first_name", "Jon")
    .attr("last_name", "Snow")
    .attr("email", "jsnow283@gmail.com")
    .attr("password", "theonlybastardchild");

  factory.define("brewery")
    .attr("id", 1)
    .attr("name", "Sample brewery")
    .attr("address1", "123 Brewery Lane")
    .attr("city", "Baltimore")
    .attr("state", "MD")
    .attr("code", "21236")
    .attr("country", "US")
    .attr("phone", "3015555555")
    .attr("website", "www.google.com")
    .attr("image_url", "http://placehold.it/300x300")
    .attr("description", "lorem ipsum")
    .attr("created_at", moment().utc().toDate().toJSON())
    .attr("updated_at", moment().utc().toDate().toJSON());

  factory.define("activity")
    .attr("user_id", 1)
    .attr("beer_id", 1)
    .attr("type", "like")
    .attr("timestamp", moment().utc().toDate().toJSON());

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
    .attr("brewery", factory.build('brewery'))
    .attr("created_at", moment().utc().toDate().toJSON())
    .attr("updated_at", moment().utc().toDate().toJSON());
};
