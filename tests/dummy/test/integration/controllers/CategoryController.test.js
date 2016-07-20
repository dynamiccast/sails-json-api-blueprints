var clone = require('clone');
var request = require('supertest');
var JSONAPIValidator = require('jsonapi-validator').Validator;

validateJSONapi = function(res) {
  var validator = new JSONAPIValidator();

  validator.validate(res.body);
}

describe("Blueprint overriding", function() {

  describe("POST /categories", function() {
    it('Should trim name', function (done) {

      var categoryToCreate = {
        'data': {
          'attributes': {
            name: " foo"
          },
          'type':'categories'
        }
      };

      categoryCreated = clone(categoryToCreate);
      categoryCreated.data.id = "1";
      categoryCreated.data.attributes.name = "foo";

      request(sails.hooks.http.app)
        .post('/categories')
        .send(categoryToCreate)
        .expect(201)
        .expect(validateJSONapi)
        .expect(categoryCreated)
        .end(done);
    });
  });

  describe('PATCH /categories/1', function() {
    it("Should time name", function(done) {

      var categoryToUpdate = {
        'data': {
          'attributes': {
            name: " bar  "
          },
          'id': "1",
          'type':'categories'
        }
      };

      let categoryUpdated = clone(categoryToUpdate);
      categoryUpdated.data.attributes.name = "bar";

      request(sails.hooks.http.app)
        .patch('/categories/1')
        .send(categoryToUpdate)
        .expect(200)
        .expect(validateJSONapi)
        .expect(categoryUpdated)
        .end(done);
    });
  });
});
