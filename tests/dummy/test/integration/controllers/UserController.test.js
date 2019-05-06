var request = require("supertest");
var JSONAPIValidator = require("jsonapi-validator").Validator;

validateJSONapi = function(res) {
  var validator = new JSONAPIValidator();

  validator.validate(res.body);
};

describe("UserController", function() {
  describe("GET /users", function() {
    it("Should return empty array", function(done) {
      request(sails.hooks.http.app)
        .get("/users")
        .expect(200)
        .expect(validateJSONapi)
        .expect({
          data: []
        })
        .end(done);
    });
  });

  describe("POST /users", function() {
    it("Should return created user", function(done) {
      var userToCreate = {
        data: {
          attributes: {
            email: "test@jsonapi.com",
            "first-name": "Test",
            "last-name": "Jsonapi"
          },
          type: "users"
        }
      };

      userCreated = userToCreate;
      userCreated.data.id = "1";

      request(sails.hooks.http.app)
        .post("/users")
        .send(userToCreate)
        .expect(201)
        .expect(validateJSONapi)
        .expect(userCreated)
        .end(done);
    });
  });

  describe("Get newly created user GET /users", function() {
    it("Should return created user", function(done) {
      request(sails.hooks.http.app)
        .get("/users")
        .expect(200)
        .expect(validateJSONapi)
        .expect({
          data: [
            {
              id: "1",
              type: "users",
              attributes: {
                email: "test@jsonapi.com",
                "first-name": "Test",
                "last-name": "Jsonapi"
              }
            }
          ]
        })
        .end(done);
    });
  });

  describe("Add second user POST /users", function() {
    it("Should return created user", function(done) {
      var userToCreate = {
        data: {
          attributes: {
            email: "test2@jsonapi.com",
            "first-name": "Test2",
            "last-name": "Jsonapi2"
          },
          type: "users"
        }
      };

      userCreated = userToCreate;
      userCreated.data.id = "2";

      request(sails.hooks.http.app)
        .post("/users")
        .send(userToCreate)
        .expect(201)
        .expect(validateJSONapi)
        .expect(userCreated)
        .end(done);
    });
  });

  describe("Get two created users GET /users", function() {
    it("Should return created user", function(done) {
      request(sails.hooks.http.app)
        .get("/users")
        .expect(200)
        .expect(validateJSONapi)
        .expect({
          data: [
            {
              id: "1",
              type: "users",
              attributes: {
                email: "test@jsonapi.com",
                "first-name": "Test",
                "last-name": "Jsonapi"
              }
            },
            {
              id: "2",
              type: "users",
              attributes: {
                email: "test2@jsonapi.com",
                "first-name": "Test2",
                "last-name": "Jsonapi2"
              }
            }
          ]
        })
        .end(done);
    });
  });

  describe("Find one user GET /users/1", function() {
    it("Should return created user", function(done) {
      request(sails.hooks.http.app)
        .get("/users/1")
        .expect(200)
        .expect(validateJSONapi)
        .expect({
          data: {
            id: "1",
            type: "users",
            attributes: {
              email: "test@jsonapi.com",
              "first-name": "Test",
              "last-name": "Jsonapi"
            }
          }
        })
        .end(done);
    });
  });

  describe("Add third user POST /users", function() {
    it("Should return created user", function(done) {
      var userToCreate = {
        data: {
          attributes: {
            email: "test3@jsonapi.com",
            "first-name": "Test3",
            "last-name": "Jsonapi2"
          },
          type: "users"
        }
      };

      userCreated = userToCreate;
      userCreated.data.id = "3";

      request(sails.hooks.http.app)
        .post("/users")
        .send(userToCreate)
        .expect(201)
        .expect(validateJSONapi)
        .expect(userCreated)
        .end(done);
    });
  });

  describe("Find user by property GET /users?filter[:prop]=value", function() {
    it("Should return Test2 user (look-up by first-name)", function(done) {
      request(sails.hooks.http.app)
        .get("/users?filter[first-name]=Test2")
        .expect(200)
        .expect(validateJSONapi)
        .expect({
          data: [
            {
              id: "2",
              type: "users",
              attributes: {
                email: "test2@jsonapi.com",
                "first-name": "Test2",
                "last-name": "Jsonapi2"
              }
            }
          ]
        })
        .end(done);
    });
    it("Should return Test2 user (look-up by email)", function(done) {
      request(sails.hooks.http.app)
        .get("/users?filter[email]=test2@jsonapi.com")
        .expect(200)
        .expect(validateJSONapi)
        .expect({
          data: [
            {
              id: "2",
              type: "users",
              attributes: {
                email: "test2@jsonapi.com",
                "first-name": "Test2",
                "last-name": "Jsonapi2"
              }
            }
          ]
        })
        .end(done);
    });
    it("Should return an empty array", function(done) {
      request(sails.hooks.http.app)
        .get("/users?filter[last-name]=NoOne")
        .expect(200)
        .expect(validateJSONapi)
        .expect({
          data: []
        })
        .end(done);
    });
    it("Should return 2 users (look-up by last-name=Jsonapi2)", function(done) {
      request(sails.hooks.http.app)
        .get("/users?filter[last-name]=Jsonapi2")
        .expect(200)
        .expect(validateJSONapi)
        .expect({
          data: [
            {
              id: "2",
              type: "users",
              attributes: {
                email: "test2@jsonapi.com",
                "first-name": "Test2",
                "last-name": "Jsonapi2"
              }
            },
            {
              id: "3",
              type: "users",
              attributes: {
                email: "test3@jsonapi.com",
                "first-name": "Test3",
                "last-name": "Jsonapi2"
              }
            }
          ]
        })
        .end(done);
    });
  });

  describe("Delete one user DELETE /users/2", function() {
    it("Should return nothing", function(done) {
      request(sails.hooks.http.app)
        .delete("/users/2")
        .expect(200)
        .expect(validateJSONapi)
        .expect({
          meta: {}
        })
        .end(done);
    });
  });

  describe("Delete one user DELETE /users/3", function() {
    it("Should return nothing", function(done) {
      request(sails.hooks.http.app)
        .delete("/users/3")
        .expect(200)
        .expect(validateJSONapi)
        .expect({
          meta: {}
        })
        .end(done);
    });
  });

  describe("Get only first created user GET /users", function() {
    it("Should return first created user", function(done) {
      request(sails.hooks.http.app)
        .get("/users")
        .expect(200)
        .expect(validateJSONapi)
        .expect({
          data: [
            {
              id: "1",
              type: "users",
              attributes: {
                email: "test@jsonapi.com",
                "first-name": "Test",
                "last-name": "Jsonapi"
              }
            }
          ]
        })
        .end(done);
    });
  });

  describe("Update first created user PATCH /users/1", function() {
    var userToUpdate = {
      data: {
        id: "1",
        type: "users",
        attributes: {
          email: "test@jsonapi.com",
          "first-name": "Updated",
          "last-name": "Jsonapi"
        }
      }
    };

    it("Should return updated user", function(done) {
      request(sails.hooks.http.app)
        .patch("/users/1")
        .expect(200)
        .send(userToUpdate)
        .expect(validateJSONapi)
        .expect(userToUpdate)
        .end(done);
    });
  });

  describe("First user should be updated GET /users", function() {
    it("Should return first created user with updated", function(done) {
      request(sails.hooks.http.app)
        .get("/users")
        .expect(200)
        .expect(validateJSONapi)
        .expect({
          data: [
            {
              id: "1",
              type: "users",
              attributes: {
                email: "test@jsonapi.com",
                "first-name": "Updated",
                "last-name": "Jsonapi"
              }
            }
          ]
        })
        .end(done);
    });
  });

  describe("Query ?me=true on GET /users", function() {
    it("Should return fake connected user", function(done) {
      var userReturned = {
        data: {
          attributes: {
            email: "root@jsonapi.com",
            "first-name": "User",
            "last-name": "Root"
          },
          id: "0",
          type: "users"
        }
      };

      request(sails.hooks.http.app)
        .get("/users?me=true")
        .expect(200)
        .expect(validateJSONapi)
        .expect(userReturned)
        .end(done);
    });
  });
});
