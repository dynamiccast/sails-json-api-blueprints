/**
 * PatchController
 *
 * @description :: Server-side logic for managing PATCH request
 *                 Simply redirect to the update blueprints
 */

"use strict";

var pluralize   = require('pluralize');
var updateBlueprint = require('../blueprints/update');

module.exports = {

  routeToUpdate: function(req, res) {

    let id = req.allParams()['id'];
    let model = pluralize.singular(req.param('model'));

    req.options.controller = model;
    req.options.model = model;
    return updateBlueprint(req, res);
  }
};
