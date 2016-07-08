/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    email: {
      type: 'string',
      email: true,
      unique: true,
      required: true
    },
    firstName: {
      type: 'string',
      minLength: 2,
      maxLength: 32,
      required: true
    },
    lastName: {
      type: 'string',
      minLength: 3,
      maxLength: 32,
      required: true
    }
  },

  autoCreatedAt: false,
  autoUpdatedAt: false
};
