var moment = require('moment');

module.exports = function (factory) {
  factory.define("activity")
    .attr("user_id", 1)
    .attr("beer_id", 1)
    .attr("type", "like")
    .attr("timestamp", moment().utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"));
};
