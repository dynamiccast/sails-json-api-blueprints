/**
 * Module dependencies
 */
let actionUtil = require("./_util/actionUtil");
let pluralize  = require("pluralize");

/**
 * Populate Relationships
 *
 * get /:modelIdentity/:parentid/:alias
 * get /:modelIdentity/:parentid/:alias/:id
 *
 * An API call to find and return relationship instances from the data adapter
 * using the specified criteria.
 *
 * Required:
 * @param {Integer|String} parentid - the unique ID of the particular parent model you'd like to look up
 * @param {String}         alias    - the collection alias used to look up relationships
 *
 * Optional:
 * @param {Integer|String} id       - the unique ID of the particular relationship model you'd like to look up *
 *
 */

module.exports = function findRecords(req, res) {
	let Model        = actionUtil.parseModel(req);
	let alias        = actionUtil.parseAlias(req);
	let parent_id    = actionUtil.parseParentId(req);
	let pk           = actionUtil.parsePk(req);
	let query_params = JsonApiService.deserialize(req.query.filter) || null;
	let query        = Model.findOne(parent_id).populate(alias, pk || null);

	query.exec((err, result) => {
		if (err) {
			return res.serverError(err);
		}

		if (!result) {
			return res.ok(result);
		}

		let sub_results = result[alias];

		if ((!sub_results || sub_results.length === 0) && pk) {
			return res.notFound("No record found with the specified ID.");
		}

		return res.ok(sub_results);
	});
};
