'use strict';

const db = require('../models')
const User = db.User
const email = ['user1@example.com', 'user2@example.com']

module.exports = {
  up: (queryInterface, Sequelize) => {
    return User.findOne({ where: { email: email[0] } })
      .then(user => {
        return queryInterface.bulkInsert('Todos', [{
          name: '五月天演唱會',
          category: '不緊急重要',
          deadline: '2019-12-01',
          done: false,
          userId: user.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          name: '余天演唱會',
          category: '不緊急不重要',
          deadline: '2019-12-21',
          done: false,
          userId: user.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          name: '阮經天演唱會',
          category: '緊急不重要',
          deadline: '2012-10-21',
          done: true,
          userId: user.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          name: '朱孝天演唱會',
          category: '不緊急不重要',
          deadline: '2018-10-21',
          done: false,
          userId: user.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }], {});
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Todos', null, {});
  }
};