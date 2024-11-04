'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Authentication extends Model {
    static associate(models) {
      // Define associations here
      Authentication.hasOne(models.Customers, {
        foreignKey: 'auth_id',
      });
      Authentication.hasOne(models.Pros, {
        foreignKey: 'auth_id',
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
    role: {
      type: DataTypes.ENUM('customer', 'pro', 'admin'),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Authentication',
    tableName: 'Authentication'
  });

  return Authentication;
};
