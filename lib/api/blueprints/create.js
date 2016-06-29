/**
 * Module dependencies
 */
var util = require( 'util' ),
  actionUtil = require( './_util/actionUtil' ),
  pluralize = require('pluralize');

var JsonApiService = require('../services/JsonApiService');

/**
 * Create Record
 *
 * post /:modelIdentity
 *
 * An API call to create and return a single model instance from the data adapter
 * using the specified criteria.
 *
 */
module.exports = function createRecord(req, res) {

  var Model = actionUtil.parseModel(req);
  var data = actionUtil.parseValues(req, Model);

  // Create new instance of model using data from params
  Model.create(data)
    .exec( (err, newInstance) => {

      if (err) return res.negotiate(err)

      var Q = Model.findOne(newInstance.id);
      Q.exec( (err, newRecord) => {

        var type = pluralize(req.options.model || req.options.controller);

        res.status(201);
        return res.json(JsonApiService.serialize(type, newRecord));
      });
    });
};
