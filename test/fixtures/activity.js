var moment = require('moment');

module.exports = [
  {
    "user_id": 283,
    "beer_id": 1,
    "type": "like",
    "timestamp": moment().utc().subtract(1, 'months').format()
  }
];
