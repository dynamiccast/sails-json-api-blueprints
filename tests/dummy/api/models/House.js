/**
 * House.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    city: {
      type: 'string'
    },

    pets: {
      collection: 'pet',
      via: 'homes',
      through: 'housepet'
    }
  }
};
