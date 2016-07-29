/**
 * HusbandController
 *
 * @description :: Server-side logic for managing husbands
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  find: function(req, res) {

    Husband.find()
      .populate("wife")
      .then(res.ok);
  }
};
