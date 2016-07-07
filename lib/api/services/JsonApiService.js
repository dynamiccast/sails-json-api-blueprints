const cleanObject = require('clean-object');
const JSONAPISerializer = require('json-api-serializer');
const Serializer = new JSONAPISerializer();

var findRecords = require('../blueprints/find');
var findOneRecord = require('../blueprints/findone');
var createRecord = require('../blueprints/create');
var destroyOneRecord = require('../blueprints/destroy');
var updateOneRecord = require('../blueprints/update');

function deepMap(obj, iterator) {
  return _.transform(obj, function(result, val, key) {
    result[key] = _.isObject(val) ?
      deepMap(val, iterator) :
      iterator.call(this, val, key, obj);
  });
}

function _setIdTypeToString(object) {

  if (typeof object['id'] === "number") {
    object['id'] = object['id'].toString();
  }

  return object;
}

module.exports = {

  findRecords: findRecords,
  findOneRecord: findOneRecord,
  createRecord: createRecord,
  destroyOneRecord: destroyOneRecord,
  updateOneRecord: updateOneRecord,

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

  deserialize: function(data) {

    // Code inspired from the MIT licenced module https://github.com/danivek/json-api-serializer
    const convertCase = function(data, convertCaseOptions) {
      let converted;
      if (_.isArray(data) || _.isPlainObject(data)) {
        converted = _.transform(data, (result, value, key) => {
          if (_.isArray(value) || _.isPlainObject(value)) {
            result[convertCase(key, convertCaseOptions)] = convertCase(value, convertCaseOptions);
          } else {
            result[convertCase(key, convertCaseOptions)] = value;
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
    };

    var caseSetting = this.getAttributesDeserializedCaseSetting();
    if (caseSetting !== undefined) {
      return convertCase(data, caseSetting);
    }

    return data;
  },

  serialize: function(modelName, data) {

    Serializer.register(modelName, {
      convertCase: this.getAttributesSerializedCaseSetting(),
      id: 'id'
    });

    var dataToSerialize = null;

    // JSON API specifies resource IDs MUST be strings
    // Let's convert all Sails integer index to strings
    if (data instanceof Array) {
      dataToSerialize = [];

      data.forEach(function(resource) {
        var object = _setIdTypeToString(resource);
        dataToSerialize.push(object);
      });
    } else if (typeof data === "object") {
      dataToSerialize = _setIdTypeToString(data);
    }

    var returnedValue = cleanObject(Serializer.serialize(modelName, dataToSerialize));
    delete returnedValue.jsonapi; // Let's ignore the version for now

    return returnedValue;
  }
}
