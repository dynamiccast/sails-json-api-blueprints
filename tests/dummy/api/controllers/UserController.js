/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  find: function(req, res) {

    if (req.allParams()["me"] === "true") {
      return res.ok({
        'data': {
          'attributes': {
            'email': 'root@jsonapi.com',
            'first-name':'User',
            'last-name':'Root'
          },
          'id': "0",
          'type':'users'
        }
      });
    }

    return JsonApiService.findRecords(req, res);
  }
};
