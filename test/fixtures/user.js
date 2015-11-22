var factory = require('sails-factory');
var stannisBaratheon = {
  "first_name": "Stannis",
  "last_name": "Baratheon",
  "email": "stannisb@gmail.com",
  "password": "theonetrueking"
};
module.exports = [factory.build('user'), factory.build('user', stannisBaratheon)];
