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
  },

  /**
   * Parse a JSON API request and set query to be populated with all defined relationships
   *
   * @param  {Object} req node request object
   * @param  {Object} query query to be executed
   * @return {Object} Returns input query with proper populate set
   */
  populateEach(req, query) {

    if (req.body && req.body.data && req.body.data.relationships) {
      for (let name in req.body.data.relationships) {
        query = query.populate(name);
      }
    } else if (req.query && req.query.include) {
      let includes = JsonApiService.deserialize(req.query.include)
      for (let name of includes) {
        query = query.populate(name);
      }
    }

    return query;
  },

  /**
   * Parse a JSON API relationship object and update given sails record
   * Model.save() will still need to be called to actually make the association to persist
   *
   * @param  {Object} recordToUpdate a single record for which relationships need to be populated
   * @param  {String} relationshipName the name of the relationship
   * @param  {Object} relationships a valid JSON API relationship object (http://jsonapi.org/format/#document-resource-object-relationships)
   * @return {undefined} nothing to return
   */
  updateRelationship(recordToUpdate, relationshipName, relationships) {

    var a = recordToUpdate[relationshipName];
    var b = relationships.data;

    var toDelete = a.filter(function(current){
      return b.filter(function(current_b){
        return current_b.id == current.id;
      }).length == 0;
    });

    var toAdd = b.filter(function(current){
      return a.filter(function(current_a){
        return current_a.id == current.id;
      }).length == 0;
    });

    toDelete.forEach((toDelete) => {
      recordToUpdate[relationshipName].remove(toDelete.id);
    });

    toAdd.forEach((toAdd) => {
      recordToUpdate[relationshipName].add(toAdd.id);
    });
  }
};
