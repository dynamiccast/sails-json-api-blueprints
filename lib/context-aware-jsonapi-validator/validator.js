const Validator = require('jsonapi-validator').Validator;
const updateValidator = new Validator(require('./update-schema.json'));
const createValidator = new Validator(require('./create-schema.json'));
const defaultValidator = new Validator();

module.exports = {

  CONTEXT_ANY: 0,
  CONTEXT_UPDATE: 1,
  CONTEXT_CREATE: 2,

  isValid: function(doc, schema) {

    var validatorStrategy = undefined;

    if (schema === this.CONTEXT_UPDATE)
      validatorStrategy = updateValidator;
    else if (schema === this.CONTEXT_CREATE)
      validatorStrategy = createValidator;
    else
      validatorStrategy = defaultValidator;

    return validatorStrategy.isValid(doc);
  }
};
