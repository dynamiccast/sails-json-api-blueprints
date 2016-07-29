var clone = require('clone');
var request = require('supertest');
var JSONAPIValidator = require('jsonapi-validator').Validator;

var util = require('util');

validateJSONapi = function(res) {
  var validator = new JSONAPIValidator();

  validator.validate(res.body);
};

describe("Has many through relationships", function() {

  describe("GET /pets", function() {

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

    it("Should return houses along with pets", function(done) {

      request(sails.hooks.http.app)
        .get('/pets')
        .expect(200)
        .expect(validateJSONapi)
        .end(done);
    });
  });

  describe("GET /husbands", function() {

    before("Populate some data", function(done) {

      Husband.create({}).then((husband) => {

        return Wife.create({
          maidenName: 'Doe',
          husband: husband
        });
      }).then(() => done());
    });

    it("Should return husband and his wife", function(done) {

      request(sails.hooks.http.app)
        .get('/husbands')
        .expect(200)
        .expect(validateJSONapi)
        .end(done);
    });
  });

});
