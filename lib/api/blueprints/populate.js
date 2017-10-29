/**
 * Module dependencies
 */
let action_util = require("./_util/actionUtil");
let pluralize   = require("pluralize");

/**
 * Find One Record
 *
 * get /:modelIdentity/:parentid/:alias
 * get /:modelIdentity/:parentid/:alias/:id
 *
 * An API call to find and return relationship instances from the data adapter
 * using the specified criteria.
 *
 * Required:
 * @param {Integer|String} parentid - the unique ID of the particular parent model you'd like to look up
 *
 * Optional:
 * @param {Integer|String} id       - the unique ID of the particular relationship model you'd like to look up *
 *
 */

module.exports = function findRecords(req, res) {
	let Model        = action_util.parseModel(req);
	let alias        = action_util.parseAlias(req);
	let parent_id    = action_util.parseParentId(req);
	let pk           = action_util.parsePk(req);
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
