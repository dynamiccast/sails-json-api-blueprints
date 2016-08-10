const _ = require("lodash");
const pluralize = require('pluralize');
const JSONAPISerializer = require('json-api-serializer');
const jsonApiValidator = require('../../context-aware-jsonapi-validator/validator');
const Serializer = new JSONAPISerializer();

var findRecords = require('../blueprints/find');
var findOneRecord = require('../blueprints/findone');
var createRecord = require('../blueprints/create');
var destroyOneRecord = require('../blueprints/destroy');
var updateOneRecord = require('../blueprints/update');

// Copied from http://stackoverflow.com/questions/13523951/how-to-check-the-depth-of-an-object
var depthOf = function(object) {
  var level = 1;
  var key;
  for (key in object) {
    if (!object.hasOwnProperty(key)) continue;

    if (_.isObjectLike(object[key])) {
      var depth = depthOf(object[key]) + 1;
      level = Math.max(depth, level);
    }
  }
  return level;
};

module.exports = {

  findRecords: findRecords,
  findOneRecord: findOneRecord,
  createRecord: createRecord,
  destroyOneRecord: destroyOneRecord,
  updateOneRecord: updateOneRecord,

  init: function() {

    for (let name in sails.models) {

      let model = sails.models[name];
      let identity = pluralize(model.identity);
      let associations = {};

      sails.log.verbose("Registering model " + name + " as " + identity);
      model.associations.forEach((association) => {

        let alias = association['alias'];
        let type = association[association['type']];

        sails.log.verbose(name + " has a relation with " + type + " (as " + alias + ")");
        associations[alias] = {
          type: pluralize(type)
        };
      });

      Serializer.register(identity, {
        id: model.primaryKey || 'id',
        convertCase: this.getAttributesSerializedCaseSetting(),
        relationships: associations
      });

      /*
       * Most of the time, no relationships are provided with the record.
       * Which is why we need a custom schema in this case
       */
      Serializer.register(identity, 'noRelationships-' + identity, {
        id: model.primaryKey || 'id',
        convertCase: this.getAttributesSerializedCaseSetting(),
        relationships: {}
      });
    };
  },

  getAttributesSerializedCaseSetting: function() {

    var caseSetting = undefined;

    if (sails.config.jsonapi !== undefined) {
      caseSetting = sails.config.jsonapi.attributesSerializedCase;
    }

    return caseSetting;
  },

  getAttributesDeserializedCaseSetting: function() {

    var caseSetting = undefined;

    if (sails.config.jsonapi !== undefined) {
      caseSetting = sails.config.jsonapi.attributesDeserializedCase;
    }

    return caseSetting;
  },

  /*
   * Method to get an sails Model from a model's name
   *
   * @method _getModelObjectFromModelName
   * @param {string} model name
   * @return {object} sails model
   */
  _getModelObjectFromModelName: function(modelName) {

    modelName = _.camelCase(modelName); // Model variable name are always in one word with no seprator
    modelName = pluralize.singular(modelName); // Model variable name are always singular
    modelName = _.upperFirst(modelName); // Model variable name always have their first letter capitalize

    return global[modelName];
  },

  // Code inspired from the MIT licenced module https://github.com/danivek/json-api-serializer
  _convertCase: function(data, convertCaseOptions) {

    let converted;

    if (_.isArray(data) || _.isPlainObject(data)) {
      converted = _.transform(data, (result, value, key) => {
        if (_.isArray(value) || _.isPlainObject(value)) {
          result[this._convertCase(key, convertCaseOptions)] = this._convertCase(value, convertCaseOptions);
        } else {
          result[this._convertCase(key, convertCaseOptions)] = value;
        }
      });
    } else {
      switch (convertCaseOptions) {
      case 'snake_case':
        converted = _.snakeCase(data);
        break;
      case 'kebab-case':
        converted = _.kebabCase(data);
        break;
      case 'camelCase':
        converted = _.camelCase(data);
        break;
      default:
        converted = data;
        break;
      }
    }

    return converted;
  },

  deserialize: function(data) {

    var caseSetting = this.getAttributesDeserializedCaseSetting();
    if (caseSetting !== undefined) {
      return this._convertCase(data, caseSetting);
    }

    return data;
  },

  serialize: function(modelName, data) {

    var returnedValue = null;
    if ((_.isArray(data) && depthOf(data) > 2) || (_.isObjectLike(data) && _.isArray(data) === false && depthOf(data) > 1)) {
      returnedValue = Serializer.serialize(modelName, data);
    } else {
      returnedValue = Serializer.serialize(modelName, data, 'noRelationships-' + modelName);
    }

    /*
     * To avoid the situation where many to many relationships are not described both ways
     * let's remove all included record's relationships
     * See https://github.com/danivek/json-api-serializer/issues/10 for more information
     */
    if (returnedValue.included) {
      returnedValue.included.forEach((include) => {
        delete include.relationships;
      });
    }
    delete returnedValue.jsonapi; // Let's ignore the version for now

    return returnedValue;
  },

  // Turn a waterline validation error object into a JSON API compliant error object
  serializeWaterlineValidationError: function(data) {

    var errors = [];

    // data.Errors is populated by sails-hook-validations and data.invalidAttributes is the default
    var targetAttributes = (data.Errors !== undefined)  ? data.Errors : data.invalidAttributes;

    for (var attributeName in targetAttributes) {

      var attributes = targetAttributes[attributeName];

      for (var index in attributes) {

        var error = attributes[index];

        errors.push({
          detail: error.message,
          source: {
            pointer: "data/attributes/" + this._convertCase(attributeName, this.getAttributesSerializedCaseSetting())
          }
        });
      }
    }

    return errors;
  },

  validate: function(doc, strategy) {

    return jsonApiValidator.isValid(doc, strategy);
  }
}
