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

  describe('GET /users/42', function() {
    it('Should return 404', function(done) {
      request(sails.hooks.http.app)
        .get('/users/42')
        .expect(404)
        .expect(validateJSONapi)

  describe('GET categories?invalid=true', function() {
    it('Should return 400', function(done) {
      request(sails.hooks.http.app)
        .get('/categories?invalid=true')
        .expect(400)
        .expect(validateJSONapi)
        .expect({
          'errors': [
            {
              status: "400",
              title: 'Bad request'
            }
          ]
        })
        .end(done);
    });
  });
});
