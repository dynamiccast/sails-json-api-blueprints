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

  var res = this.res;
  var statusCode = err.status || 500;

  res.status(statusCode);

  // Respond using the appropriate custom response
  if (statusCode === 403) return res.forbidden(err);
  if (statusCode === 404) return res.notFound(err);

  // This check is specific to sails-json-api-blueprints
  if (statusCode === 400 && err.code === "E_VALIDATION") return res.invalid(err);
  if (statusCode === 400) return res.badRequest(err);

  return res.json(err);
};
