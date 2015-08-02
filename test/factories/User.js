module.exports = function (factory) {
  factory.define("user")
    .attr("first_name", "Jon")
    .attr("last_name", "Snow")
    .attr("email", "jsnow283@gmail.com")
    .attr("password", "theonlybastardchild");
};
