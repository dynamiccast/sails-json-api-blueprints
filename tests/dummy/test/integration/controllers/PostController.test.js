var request = require('supertest');
var JSONAPIValidator = require('jsonapi-validator').Validator;

validateJSONapi = function(res) {
  var validator = new JSONAPIValidator();

  validator.validate(res.body);
};

updatedAtToBeCorrect = function(res) {

  var updatedAt = res.body.data.attributes["updated-at"];
  var dateAsString = new Date().toISOString();
  var dateNoTimezone = dateAsString.substr(0, dateAsString.lastIndexOf("."));
  var updatedAtNoTimezone = updatedAt.substr(0, updatedAt.lastIndexOf("."));;

  if (updatedAtNoTimezone !== dateNoTimezone) {
    throw new Error("UpdatedAt is not current date");
  }
};

createdAtToBeNow = function(res) {

  var createdAt = res.body.data.attributes["created-at"];
  var dateAsString = new Date().toISOString();
  var dateNoTimezone = dateAsString.substr(0, dateAsString.lastIndexOf("."));
  var createdAtNoTimezone = createdAt.substr(0, createdAt.lastIndexOf("."));;

  if (createdAtNoTimezone !== dateNoTimezone) {
    throw new Error("CreatedAt is not current date");
  }

}

describe('PostController', function() {

  describe('POST /posts', function() {

    it('Should return created post', function (done) {

      var postToCreate = {
        'data': {
          'attributes': {
            'title': 'Title test',
            'content': 'Lorem Ipsum'
          },
          'type':'posts'
        }
      };

      request(sails.hooks.http.app)
        .post('/posts')
        .send(postToCreate)
        .expect(201)
        .expect(validateJSONapi)
        .expect(createdAtToBeNow)
        .expect(updatedAtToBeCorrect)
        .end(done)
    });

    it('Should update created post', function (done) {

      var postToUpdate = {
        'data': {
          'attributes': {
            'title': 'Title updated',
            'content': 'Lorem Ipsum'
          },
          'type':'posts',
          "id": "1"
        }
      };

      request(sails.hooks.http.app)
        .patch('/posts/1')
        .send(postToUpdate)
        .expect(200)
        .expect(validateJSONapi)
        .expect(updatedAtToBeCorrect)
        .end(done)
    });
  });
});
