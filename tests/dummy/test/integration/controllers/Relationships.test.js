var clone = require('clone');
var request = require("supertest-as-promised");
var JSONAPIValidator = require('jsonapi-validator').Validator;
const assert = require('assert');

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

  describe("PATCH /pets", function() {

    it("Should add a new relationship to an existing record", function(done) {

      request(sails.hooks.http.app)
        .post('/pets')
        .send({
          "data": {
            "type": "pets",
            "attributes": {
              "name": "Dushi",
              "color": "black"
            }
          }
        })
        .expect(201)
        .expect(validateJSONapi)
        .then((res) => {

          let petId = res.body.data.id;

          request(sails.hooks.http.app)
            .post('/houses')
            .send({
              "data" : {
                "type": "houses",
                "attributes": {
                  "city": "Paris"
                }
              }
            })
            .expect(201)
            .expect(validateJSONapi)
            .then((res) => {

              let houseId = res.body.data.id;

              request(sails.hooks.http.app)
                .patch('/pets/' + petId)
                .send({
                  "data": {
                    "id": petId,
                    "type": "pets",
                    "attributes": {
                      "name": "Dushi",
                      "color": "white"
                    },
                    "relationships": {
                      "homes": {
                        "data": [{
                          "type": "houses",
                          "id": houseId
                        }]
                      }
                    }
                  }
                })
                .expect(200)
                .expect(validateJSONapi)
                .expect({
                  "data": {
                    "type": "pets",
                    "id": petId,
                    "attributes": {
                      "name": "Dushi",
                      "color": "white" // value should be updated
                    },
                    "relationships": {
                      "homes": {
                        "data": [{
                          "type": "houses",
                          "id": houseId
                        }]
                      }
                    }
                  },
                  "included": [{
                    "type": "houses",
                    "id": houseId,
                    "attributes": {
                      "city": "Paris"
                    }
                  }]
                })
                .end(done);
            });
        });
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

  describe("GET /wives", function () {
    before("Populate some data", done => {
      Husband.create({}).then((husband) => {
        return Wife.create({
          maidenName: 'Doe',
          husband: husband
        });
      }).then(() => done());
    });

    it("Should return wife without her husband", done => {

      request(sails.hooks.http.app)
        .get('/wives')
        .expect(200)
        .expect(validateJSONapi)
        .expect(({body}) => {
          assert((typeof body.included) === "undefined", "there should be nothing included by default");
        })
        .end(done);
    })

    it("Should return wife and her husband", done => {

      request(sails.hooks.http.app)
        .get('/wives?include[]=husband')
        .expect(200)
        .expect(validateJSONapi)
        .expect(({body}) => {
          assert(body.included.every(includedRecord => includedRecord.type === 'husbands'), "only husbands should be included");
        })
        .end(done);
    })
  })

});
