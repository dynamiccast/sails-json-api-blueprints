/**
 * 500 (Server Error) Response
 *
 * Usage:
 * return res.serverError();
 * return res.serverError(err);
 * return res.serverError(err, 'some/specific/error/view');
 *
 * NOTE:
 * If something throws in a policy or controller, or an internal
 * error is encountered, Sails will call `res.serverError()`
 * automatically.
 */

module.exports = function serverError (data, options) {

  // Get access to `req`, `res`, & `sails`
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  // Set status code
  res.status(500);

  // Log error to console
  if (data !== undefined) {
    sails.log.error('Sending 500 ("Server Error") response: \n',data);
  }
  else sails.log.error('Sending empty 500 ("Server Error") response');

  return res.json({
    'errors': [
      {
        status: "500",
        title: 'Internal server error',
        detail: data
      }
    ]
  });

};
