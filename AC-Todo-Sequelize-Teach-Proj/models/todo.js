'use strict';
module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define('Todo', {
    name: DataTypes.STRING,
    done: DataTypes.BOOLEAN,
    category: DataTypes.STRING,
    deadline: DataTypes.DATEONLY
  }, {});
  Todo.associate = function (models) {
    // associations can be defined here
    Todo.belongsTo(models.User)
  };
  return Todo;
};