'use strict';
const bcrypt = require('bcryptjs')

const genHash = (password) => {
  return bcrypt
    .genSalt(10)
    .then(salt => {
      return bcrypt.hash(password, salt)
    })
    .catch(err => {
      return console.log(err)
    })
}

module.exports = {
  up: (queryInterface, Sequelize) => {

    return Promise
      .all([genHash('123'), genHash('123')])
      .then(hashs => {

        return queryInterface.bulkInsert('Users', [{
          name: 'John Doe',
          email: 'user1@example.com',
          password: hashs[0],
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          name: 'John wick ',
          email: 'user2@example.com',
          password: hashs[1],
          createdAt: new Date(),
          updatedAt: new Date()
        }], {});
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
