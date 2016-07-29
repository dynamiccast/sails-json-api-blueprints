/**
 * PetController
 *
 * @description :: Server-side logic for managing Pets
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  find: function(req, res) {

    Pet.find()
      .populate('homes')
      .then(res.ok);
  }
};
