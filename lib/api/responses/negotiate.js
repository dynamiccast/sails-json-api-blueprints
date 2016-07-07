/**
 * Generic Error Handler / Classifier with validation handler
 *
 * Copied from https://github.com/balderdashy/sails/blob/109254834fe7202c4f630c2da9c1cbf97bf4c016/lib/hooks/responses/defaults/negotiate.js
 *
 * Calls the appropriate custom response for a given error,
 * out of the bundled response modules:
 * badRequest, forbidden, notFound, & serverError
 *
 * Defaults to `res.serverError`
 *
 * Usage:
 * ```javascript
 * if (err) return res.negotiate(err);
 * ```
 *
 * @param {*} error(s)
 *
 */

module.exports = function negotiate (err) {

  // Get access to response object (`res`)
  var res = this.res;

  var statusCode = 500;
  var body = err;

  try {

    statusCode = err.status || 500;

    // Set the status
    // (should be taken care of by res.* methods, but this sets a default just in case)
    res.status(statusCode);

  } catch (e) {}

  // Respond using the appropriate custom response
  if (statusCode === 403) return res.forbidden(body);
  if (statusCode === 404) return res.notFound(body);

  console.log(body);
  // This check is specific to sails-json-api-blueprints
  if (statusCode === 400 && err.code === "E_VALIDATION") return res.invalid(body);

  if (statusCode >= 400 && statusCode < 500) return res.badRequest(body);
  return res.serverError(body);
};
