'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    image: {
      type: DataTypes.STRING,
      defaultValue: 'https://picsum.photos/id/1026/4621/3070'
    }
  }, {});
  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.Comment)
  };
  return User;
};