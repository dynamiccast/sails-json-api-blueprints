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
  }

};
