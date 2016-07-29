var clone = require('clone');
var request = require('supertest');
var JSONAPIValidator = require('jsonapi-validator').Validator;

validateJSONapi = function(res) {
  var validator = new JSONAPIValidator();

  validator.validate(res.body);
};

describe("Has many through relationships", function() {

  before("Populate some data", function(done) {

    Pet.create({
      name: 'doug',
      color: 'blue'
    }).then((dog) => {

      return House.create({
        city: 'Long Beach'
      }).then((house) => {

        house.pets.add(dog);
        house.save((err) => {
          done(err);
        });
      });
    });
  });

  describe("GET /pets", function() {
    it("Should return houses along with pets", function(done) {

      request(sails.hooks.http.app)
        .get('/pets')
        .expect(200)
        .expect(validateJSONapi)
        .end(done);
    });
  });
});
