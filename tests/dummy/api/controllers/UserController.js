/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var findRecords = require('sails-json-api-blueprints/lib/api/blueprints/find');

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

    return findRecords(req, res);
  }
};
