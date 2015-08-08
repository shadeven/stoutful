var moment = require('moment');

module.exports = function (factory) {
  factory.define("/api/activities")
    .attr("id", 1)
    .attr("user_id", 1)
    .attr("beer_id", 1)
    .attr("type", "check_in")
    .attr("timestamp", moment().utc().toDate().toJSON())
    .attr("beer", factory.build('beer'));
};
