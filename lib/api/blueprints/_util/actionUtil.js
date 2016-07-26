/**
 * Utility methods used in built-in blueprint actions.
 *
 * @type {Object}
 */
module.exports = {

  /**
   * Determine the model class to use w/ this blueprint action.
   * @param  {Request} req
   * @return {WLCollection}
   */
  parseModel: function(req) {

    // Ensure a model can be deduced from the request options.
    var model = req.options.model || req.options.controller;
    if (!model) {
      throw new Error('No "model" specified in route options.');
    }

    var Model = req._sails.models[model];
    if (!Model) {
      throw new Error('Invalid route option, "model". No model named: ' + model);
    }

    return Model;
  },

  /**
   * Parse `values` for a Waterline `create` or `update` from all
   * request parameters.
   *
   * @param  {Request} req
   * @return {Object}
   */
  parseValues: function(req, model) {

    var values = req.body.data.attributes || {};

    if (req.allParams()['id']) {
      values[model.primaryKey] = req.allParams()['id'];
    }

    return values;
  },

  /**
   * Parse primary key value for use in a Waterline criteria
   * (e.g. for `find`, `update`, or `destroy`)
   *
   * @param  {Request} req
   * @return {Integer|String}
   */
  parsePk: function(req) {

    return req.options.id || ( req.options.where && req.options.where.id ) || req.allParams()['id'];
  },

  /**
   * Parse primary key value from parameters.
   * Throw an error if it cannot be retrieved.
   *
   * @param  {Request} req
   * @return {Integer|String}
   */
  requirePk: function(req) {

    var pk = module.exports.parsePk(req);

    // Validate the required `id` parameter
    if (!pk) {

      var err = new Error(
        'No `id` parameter provided.' +
        '(Note: even if the model\'s primary key is not named `id`- ' +
        '`id` should be used as the name of the parameter- it will be ' +
        'mapped to the proper primary key name)'
      );
      err.status = 400;
      throw err;
    }

    return pk;
  }
};
