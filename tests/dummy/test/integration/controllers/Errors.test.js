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
        .expect({
          'errors': [
            {
              status: "404",
              title: 'Resource not found'
            }
          ]
        })
        .end(done);
    });
  });

  describe('GET /users/42', function() {
    it('Should return 404', function(done) {
      request(sails.hooks.http.app)
        .get('/users/42')
        .expect(404)
        .expect(validateJSONapi)
        .expect({
          'errors': [
            {
              status: "404",
              title: 'Resource not found',
              detail: 'No record found with the specified id.'
            }
          ]
        })
        .end(done);
    });
  });

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
              title: 'Bad request',
              detail: "Something is rotten in the state of denmark"
            }
          ]
        })
        .end(done);
    });
  });

  describe('GET categories?forbidden=true', function() {
    it('Should return 403', function(done) {
      request(sails.hooks.http.app)
        .get('/categories?forbidden=true')
        .expect(403)
        .expect(validateJSONapi)
        .expect({
          'errors': [
            {
              status: "403",
              title: 'Forbidden',
              detail: "You don't wanna do that"
            }
          ]
        })
        .end(done);
    });
  });

  describe('GET categories?error=true', function() {
    it('Should return 500', function(done) {
      request(sails.hooks.http.app)
        .get('/categories?error=true')
        .expect(500)
        .expect(validateJSONapi)
        .expect({
          'errors': [
            {
              status: "500",
              title: 'Internal server error',
              detail: 'A super massive black hole just swallowed the server'
            }
          ]
        })
        .end(done);
    });
  });

  describe('POST /users with invalid attributes', function() {
    it('Should return 400 with error details', function (done) {

      var userToCreate = {
        'data': {
          'attributes': {
            'email': 'test@jsonapi.com',
            'first-name':'a', // This is invalid. Minimum length is 3
            'last-name':'api'
          },
          'type':'users'
        }
      };

      request(sails.hooks.http.app)
        .post('/users')
        .send(userToCreate)
        .expect(400)
        .expect(validateJSONapi)
        .expect({
          "errors": [
            {
              "detail": "user.firstName.minLength",
              "source": {
                "pointer": "data/attributes/first-name"
              }
            }
          ]
        })
        .end(done);
    });
  });

  describe("POST /categories with invalid attributes", function() {
    it('Should return human readable errors from sails-hook-validation', function (done) {

      var categoryToCreate = {
        'data': {
          'attributes': {
            name: "a" // Invalid because minLength is 2
          },
          'type':'categories'
        }
      };

      request(sails.hooks.http.app)
        .post('/categories')
        .send(categoryToCreate)
        .expect(400)
        .expect(validateJSONapi)
        .expect({
          errors: [
            {
              detail: "Minimum length is 2",
              source: {
                pointer: "data/attributes/name"
              }
            }
            ]
        })
        .end(done);
    });
  });
});
