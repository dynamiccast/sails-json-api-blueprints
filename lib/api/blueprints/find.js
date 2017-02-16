/**
 * Module dependencies
 */
var actionUtil = require('./_util/actionUtil');
/**
 * Find Records
 *
 *  get   /:modelIdentity
 *
 * An API call to find and return model instances from the data adapter
 * using the specified criteria.
 *
 */

module.exports = function findRecords(req, res) {

  // Look up the model
  var Model = actionUtil.parseModel(req);

  // Lookup for records that match the specified criteria

  var queryParams = JsonApiService.deserialize(req.query.filter) || null;

  var query = Model.find(queryParams);

  // populate as required
  actionUtil.populateEach(req, query);

  query.exec((err, matchingRecords) => {

    if (err) return res.serverError(err);

    return res.ok(matchingRecords);
  });
};
