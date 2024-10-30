'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Authentication extends Model {
    static associate(models) {
      // Define associations here
      Authentication.belongsTo(models.Customers, {
        foreignKey: 'customer_id',
        onDelete: 'CASCADE',
      });
      Authentication.belongsTo(models.Pros, {
        foreignKey: 'pro_id',
        onDelete: 'CASCADE',
      });
    }
  }

  Authentication.init({
    auth_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    hashed_password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Authentication',
    tableName: 'Authentication'
  });

  return Authentication;
};
