const JsonApiService = require("../../../lib/api/services/JsonApiService");
var JSONAPIValidator = require('jsonapi-validator').Validator;
const expect = require('chai').expect;

validateJSONapi = function(data) {
  var validator = new JSONAPIValidator();

  try {
    validator.validate(data);
    return true;
  } catch (e) {
    return false;
  }
};

sails = {
  config: {}
};

describe("Is JsonApiService present", function() {

  it("Should be an object", function() {

    expect(JsonApiService).to.be.an('object');
  });
});

describe("Serialize Waterline validation error", function() {

  describe("Serialize default Waterline error object", function() {

    const waterlineErr = {
      "error": "E_VALIDATION",
      "status": 400,
      "summary": "1 attribute is invalid",
      "model": "User",
      "invalidAttributes": {
        "firstName": [
          {
            "rule": "minLength",
            "message": "\"minLength\" validation rule failed for input: 'a'\nSpecifically, it threw an error.  Details:\n undefined"
          }
        ]
      }
    };

    const expectedOutput = {
        "errors": [
          {
            "detail": "\"minLength\" validation rule failed for input: 'a'\nSpecifically, it threw an error.  Details:\n undefined",
            "source": {
              "pointer": "data/attributes/firstName"
            }
          }
        ]
      };

    var jsonApiError = {
      errors: JsonApiService.serializeWaterlineValidationError(waterlineErr)
    };

    it("Should be valid JSON API", function() {

      expect(jsonApiError).to.satisfy(validateJSONapi);
    });

    it("Should produce expected output", function() {

      expect(jsonApiError).to.deep.equal(expectedOutput);
    });
  });

  describe("Serialize Waterline error object produces by sails-validation-hook", function() {

    const waterlineErr = {
      "error": "E_VALIDATION",
      "status": 400,
      "summary": "1 attribute is invalid",
      "model": "User",
      "invalidAttributes": {
        "firstName": [
          {
            "rule": "minLength",
            "message": "\"minLength\" validation rule failed for input: 'a'\nSpecifically, it threw an error.  Details:\n undefined"
          }
        ]
      },
      "Errors": {
        "firstName": [
          {
            "rule": "minLength",
            "message": "Minimum length is 2"
          }
        ]
      }
    };

    const expectedOutput = {
      "errors": [
        {
          "detail": "Minimum length is 2",
          "source": {
            "pointer": "data/attributes/firstName"
          }
        }
      ]
    };

    var jsonApiError = {
      errors: JsonApiService.serializeWaterlineValidationError(waterlineErr)
    };

    it("Should be valid JSON API", function() {

      expect(jsonApiError).to.satisfy(validateJSONapi);
    });

    it("Should produce expected output", function() {

      expect(jsonApiError).to.deep.equal(expectedOutput);
    });
  });
});
