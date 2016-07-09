const JsonApiService = require("../../../lib/api/services/JsonApiService");
const expect = require('chai').expect;

describe("Is JsonApiService present", function() {

  it("Should be an object", function() {

    expect(JsonApiService).to.be.an('object');
  });
});
