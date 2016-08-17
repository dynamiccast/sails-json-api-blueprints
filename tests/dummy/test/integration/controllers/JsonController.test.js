var request = require('supertest');
var JSONAPIValidator = require('jsonapi-validator').Validator;

validateJSONapi = function(res) {
  var validator = new JSONAPIValidator();

  validator.validate(res.body);
};

describe('toJSON compatibility', function() {

  it('Should return record without the hidden field', function(done) {

    let toCreate = {
      'data': {
        'attributes': {
          variable: "test",
          invisible: "should not be displayed"
        },
        'type': 'jsons'
      }
    };

    request(sails.hooks.http.app)
      .post('/jsons')
      .send(toCreate)
      .expect(201)
      .expect(validateJSONapi)
      .expect({
        data: {
          id: '1',
          type: 'jsons',
          attributes: {
            variable: 'test'
          }
        }
      })
      .end(done);
  });
});
