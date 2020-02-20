'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('Todos', 'category', {
          type: Sequelize.STRING,
          allowNull: false
        }, { transaction: t }),
        queryInterface.addColumn('Todos', 'deadline', {
          type: Sequelize.DATEONLY,
          allowNull: false,
        }, { transaction: t })
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('Todos', 'category', { transaction: t }),
        queryInterface.removeColumn('Todos', 'deadline', { transaction: t })
      ])
    })
  }
};
