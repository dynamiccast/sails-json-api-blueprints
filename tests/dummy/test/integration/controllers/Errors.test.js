var request = require('supertest');
var JSONAPIValidator = require('jsonapi-validator').Validator;

validateJSONapi = function(res) {
  var validator = new JSONAPIValidator();

  validator.validate(res.body);
}

describe('Error handling', function() {
  describe('GET /fake', function() {
    it('Should return 404', function(done) {
      request(sails.hooks.http.app)
        .get('/fake')
        .expect(404)
        .expect(validateJSONapi)
        .end(done);
    });
  });
});
