const cleanObject = require('clean-object');
const JSONAPISerializer = require('json-api-serializer');
const Serializer = new JSONAPISerializer();

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

  serialize: function(modelName, data) {

    Serializer.register(modelName, {
      convertCase: 'kebab-case',
      id: 'id'
    });

    // JSON API specifies resource IDs MUST be strings
    // Let's convert all Sails integer index to strings
    if (typeof data === "object") {
      data = _setIdTypeToString(data);
    } else if (typeof data === "array") {
      data.forEach(function(object) {
        object = _setIdTypeToString(object);
      });
    }

    var returnedValue = cleanObject(Serializer.serialize(modelName, data));
    delete returnedValue.jsonapi; // Let's ignore the version for now

    return returnedValue;
  }
}
