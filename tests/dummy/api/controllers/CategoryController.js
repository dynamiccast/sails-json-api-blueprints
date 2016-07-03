/**
 * CategoryController
 *
 * @description :: Server-side logic for managing categories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  create: function(req, res) {

    if (typeof JsonApiService === "undefined") {
      throw new Error("JsonApiService is not injected");
    }

    req.body.data.attributes.name = req.body.data.attributes.name.trim();

    return JsonApiService.createRecord(req, res);
  },

  find: function(req, res) {

    if (req.allParams()['invalid'] === "true") {
      return res.badRequest();
    }

    if (req.allParams()['forbidden'] === "true") {
      return res.forbidden();
    }

    if (req.allParams()['error'] === "true") {
      return res.serverError('A super massive black hole just swallowed the server');
    }

    return JsonApiService.findRecords(req. res);
  }

};
