/**
 * Category.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string',
      minLength: 2,
      maxLength: 15,
      required: true
    }
  },

  //model validation messages definitions
  validationMessages: { //hand for i18n & l10n
    name: {
      minLength: 'Minimum length is 2',
      maxLength: 'Minimum length is 15',
      required: 'Name is required'
    }
  },

  autoCreatedAt: false,
  autoUpdatedAt: false
};
