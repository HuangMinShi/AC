'use strict';

const db = require('../models')
const User = db.User
const Op = db.Sequelize.Op;
const records = require('./seeds.json')

const insertRecordFields = () => {
  return User
    .findAll({
      where: {
        [Op.or]: [
          { email: 'user1@example.com' },
          { email: 'user2@example.com' }
        ]
      }
    })
    .then(users => {
      const ids = users.map(item => item.id)

      records.forEach(record => {
        const index = Math.floor(Math.random() * 2)

        record.UserId = ids[index]
        record.createdAt = new Date()
        record.updatedAt = new Date()
      })

      return records
    })
    .catch(err => {
      return console.log(err)
    })
}

module.exports = {
  up: (queryInterface, Sequelize) => {

    return insertRecordFields()
      .then(records => {

        return queryInterface.bulkInsert('Records', records, {})
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Records', null, {});
  }
};
