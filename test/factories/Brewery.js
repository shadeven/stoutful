module.exports = function (factory) {
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
    .attr("description", "lorem ipsum");
};
