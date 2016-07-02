/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  find: function(req, res) {

    if (req.allParams()["me"] === "true") {

      var me = JsonApiService.serialize('users', {
        id: '0',
        'email': 'root@jsonapi.com',
        'first-name':'User',
        'last-name':'Root'
      });

      return res.ok(me);
    }

    return JsonApiService.findRecords(req, res);
  }
};
