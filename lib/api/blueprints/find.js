/**
 * Module dependencies
 */
var actionUtil = require("./_util/actionUtil");
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
  let Model = actionUtil.parseModel(req);

  // Lookup for records that match the specified criteria

  let queryParams = JsonApiService.deserialize(req.query.filter) || null;

  if (queryParams) {
    // This allows to more advance filtering things like '?filter[date]={"<":"YYYY-MM-DD"}'
    let params = Object.entries(queryParams).map(([key, value]) => {
      try {
        let val = JSON.parse(value);
        return [key, val];
      } catch (err) {
        return [key, value];
      }
    });
    queryParams = params.reduce(
      (qp, [key, value]) => ({ ...qp, [key]: value }),
      {}
    );
  }
  let query = Model.find(queryParams);

  // populate as required
  actionUtil.populateEach(req, query);

  query.exec((err, matchingRecords) => {
    if (err) return res.serverError(err);

    return res.ok(matchingRecords);
  });
};
