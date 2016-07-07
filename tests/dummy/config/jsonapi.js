/**
 * JSON API Variable Configuration
 * (sails.config.jsonapi)
 *
 * Configure sails-json-api-blueprints
 *
 * For more information on configuration, check out:
 * https://github.com/dynamiccast/sails-json-api-blueprints/blob/master/README.md
 */
module.exports.jsonapi = {

  /*
   * Customize models attributes's key to allows attributes in Sails member to be in a different format than in json
   * For example Model.firstName become attributes: { 'first-name': ...} once serialized in json
   *
   * JSON API RECOMMENDS a dash is used as a separator between multiple words (kebab-case)
   * http://jsonapi.org/recommendations/#naming
   *
   * Ember.js expects json to be in kebab-case
   *
   * Possible values are:
   * - snake_case: first_name
   * - kebab-case: first-name
   * - camel-case: firstName
   *
   * Default is undefined, that is to say untouched
   *
   */
  attributesSerializedCase: 'kebab-case'
};
