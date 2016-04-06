var moment = require("moment");

module.exports = function (factory) {
  factory.define("/api/activities")
    .attr("id", 1)
    .attr("type", "check_in")
    .attr("timestamp", moment().utc().format());

  factory.define("/api/beers/1/stats")
    .attr("like_count", 1)
    .attr("check_in_count", 1);
};
