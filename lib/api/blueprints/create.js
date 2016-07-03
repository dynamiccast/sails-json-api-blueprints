/**
 * Module dependencies
 */
var actionUtil = require('./_util/actionUtil');

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

      if (err) return res.negotiate(err);

      var Q = Model.findOne(newInstance.id);
      Q.exec( (err, newRecord) => {

        return res.created(newRecord);
      });
    });
};
