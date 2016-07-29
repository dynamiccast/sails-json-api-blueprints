module.exports = {
  attributes: {
    name: {
      type: 'string'
    },
    color: {
      type: 'string'
    },

    homes: {
      collection: 'house',
      via: 'pets',
      through: 'housepet'
    }
  }
};
