var clone = require('clone');
var request = require('supertest');
var JSONAPIValidator = require('jsonapi-validator').Validator;

validateJSONapi = function(res) {
  var validator = new JSONAPIValidator();

  validator.validate(res.body);
};

describe("Custom primary key name", function() {

  describe("POST /customs", function() {

    it('Should return a unique identifier from custom sails primaryKey', function (done) {

      var categoryToCreate = {
        'data': {
          'attributes': {
          },
          'type':'customs'
        }
      };

      categoryCreated = clone(categoryToCreate);
      categoryCreated.data.id = "1";

      request(sails.hooks.http.app)
        .post('/customs')
        .send(categoryToCreate)
        .expect(201)
        .expect(validateJSONapi)
        .expect(categoryCreated)
        .end(done);
    });
  });
});
