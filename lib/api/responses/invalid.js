/**
 * 400 (Bad Request) Invalid data handler
 *
 * Usage:
 * return res.invalid(err);
 *
 * err must be returned from waterline with an error of type "E_VALIDATION"
 */

module.exports = function invalid(data, options) {

  // Get access to `req`, `res`, & `sails`
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  // Set status code
  res.status(400);

  // Return 500 if no error was provided
  if (data === undefined || data.code !== "E_VALIDATION") {
    sails.log.verbose('res.invalid was called with invalid waterline error data: \n', data);
    return res.serverError('res.invalid was called with invalid waterline error data\n');
  }

  return res.json({
    'errors': JsonApiService.serializeWaterlineValidationError(data)
  });
};
