var omit          = require('lodash/omit');
var isObject      = require('lodash/isObject');

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
  parseModel: function ( req ) {

    // Ensure a model can be deduced from the request options.
    var model = req.options.model || req.options.controller;
    if ( !model ) throw new Error( util.format( 'No "model" specified in route options.' ) );

    var Model = req._sails.models[ model ];
    if ( !Model ) throw new Error( util.format( 'Invalid route option, "model".\nI don\'t know about any models named: `%s`', model ) );

    return Model;
  },

    /**
   * Parse `values` for a Waterline `create` or `update` from all
   * request parameters.
   *
   * @param  {Request} req
   * @return {Object}
   */
  parseValues: function ( req, model ) {
    // Create data object (monolithic combination of all parameters)
    // Omit the blacklisted params (like JSONP callback param, etc.)

    // Allow customizable blacklist for params NOT to include as values.
    req.options.values = req.options.values || {};
    req.options.values.blacklist = req.options.values.blacklist;

    // Validate blacklist to provide a more helpful error msg.
    var blacklist = req.options.values.blacklist;
    if ( blacklist && !isArray( blacklist ) ) {
      throw new Error( 'Invalid `req.options.values.blacklist`. Should be an array of strings (parameter names.)' );
    }

    // Get values using the model identity as resource identifier
    var values = req.body.data.attributes || {};
    values.id = req.body.id;

    // Omit built-in runtime config (like query modifiers)
    values = omit( values, blacklist || [] );

    // Omit any params w/ undefined values
    values = omit( values, function ( p ) {
      if ( isUndefined( p ) ) return true;
    });

    return values;
  },

  /**
   * Parse primary key value for use in a Waterline criteria
   * (e.g. for `find`, `update`, or `destroy`)
   *
   * @param  {Request} req
   * @return {Integer|String}
   */
  parsePk: function ( req ) {

    return req.options.id || ( req.options.where && req.options.where.id ) || req.allParams()['id'];
  },

  /**
   * Parse primary key value from parameters.
   * Throw an error if it cannot be retrieved.
   *
   * @param  {Request} req
   * @return {Integer|String}
   */
  requirePk: function ( req ) {
    var pk = module.exports.parsePk( req );

    // Validate the required `id` parameter
    if ( !pk ) {

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
