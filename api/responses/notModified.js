/**
 * 304 (Not Modified) Response
 *
 * Usage:
 * return res.notModified();
 *
 */

 module.exports = function() {
   var res = this.res;
   res.status(304).end();
 };
