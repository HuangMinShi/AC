'use strict';
module.exports = (sequelize, DataTypes) => {
  const Record = sequelize.define('Record', {
    item: DataTypes.STRING,
    category: DataTypes.STRING,
    merchant: DataTypes.STRING,
    amount: DataTypes.NUMBER,
    date: DataTypes.DATEONLY
  }, {});
  Record.associate = function (models) {
    // associations can be defined here
    Record.belongsTo(models.User)
  };
  return Record;
};