/**
 * Custom.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  autoPK: false,

  attributes: {
    key: {
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      unique: true,
      index: true
    }
  },

  autoCreatedAt: false,
  autoUpdatedAt: false
};
