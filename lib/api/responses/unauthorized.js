/**
 * 401 (Unauthorized) Handler
 *
 * Usage:
 * return res.unauthorized();
 * return res.unauthorized(err);
 * return res.unauthorized(err, 'some/specific/unauthorized/view');
 *
 * e.g.:
 * ```
 * return res.unauthorized('Access denied.');
 * ```
 */

module.exports = function unauthorized (data, options) {

  // Get access to `req`, `res`, & `sails`
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  // Set status code
  res.status(401);
  sails.log.debug('we are in the unauthorized secion!');

  // Log error to console
  if (data !== undefined) {
    sails.log.verbose('Sending 401 ("Unauthorized") response: \n',data);
  }
  else sails.log.verbose('Sending 401 ("Unauthorized") response');

  return res.json({
    'errors': [
      {
        status: "401",
        title: 'Unauthorized',
        detail: data
      }
    ]
  });

};
