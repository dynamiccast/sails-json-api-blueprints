/**
 * CategoryController
 *
 * @description :: Server-side logic for managing categories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var createRecord = require('sails-json-api-blueprints/lib/api/blueprints/create');

module.exports = {

  create: function(req, res) {

    req.body.data.attributes.name = req.body.data.attributes.name.trim();

    return createRecord(req, res);
  }
};
