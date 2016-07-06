/**
 * 400 (Bad Request) Invalid JSON API Handler
 *
 * Usage:
 * return res.invalidJsonApi();
 *
 */

module.exports = function invalidJsonApi(data, options) {

  // Get access to `req`, `res`, & `sails`
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  // Set status code
  res.status(400);

  sails.log.verbose('Sending 400 ("Bad Request") invalid JSON API input');

  return res.json({
    'errors': [
      {
        status: "400",
        title: 'Bad request',
        detail: 'Invalid JSON API data',
        links: {
          self: 'http://jsonapi.org/format/'
        }
      }
    ]
  });
};
