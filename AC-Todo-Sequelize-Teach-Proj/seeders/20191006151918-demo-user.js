'use strict';
const bcrypt = require('bcryptjs')
const password = '123'

const genHashPassword = () => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return reject(err)
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) return reject(err)
        return resolve(hash)
      })
    })
  })
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([genHashPassword(), genHashPassword()])
      .then(hashs => {
        return Promise.all([
          queryInterface.bulkInsert('Users', [{
            name: 'user1',
            email: 'user1@example.com',
            password: hashs[0],
            createdAt: new Date(),
            updatedAt: new Date()
          }], {}),
          queryInterface.bulkInsert('Users', [{
            name: 'user2',
            email: 'user2@example.com',
            password: hashs[1],
            createdAt: new Date(),
            updatedAt: new Date()
          }], {})
        ])
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
