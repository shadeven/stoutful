var moment = require('moment');

module.exports = function (factory) {
  factory.define("/api/activities")
    .attr("id", 1)
    .attr("beer_id", 1)
    .attr("type", "check_in")
    .attr("timestamp", moment().utc().toDate().toJSON())
    .attr("beer", factory.build('beer', {'brewery': factory.build('brewery')}));

  factory.define("/api/beers/1/stats")
    .attr("like_count", 1)
    .attr("check_in_count", 1);
};
