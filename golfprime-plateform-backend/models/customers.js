'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customers extends Model {
    static associate(models) {
      Customers.belongsToMany(models.Golfs, {
        through: models.GolfsCustomers,
        foreignKey: 'customer_id'
      });
      Customers.hasMany(models.Bookings, {
        foreignKey: 'customer_id'
      })
    }
  }
  Customers.init({
    customer_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM('male', 'female'),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true, 
      validate: {
        isEmail: true, 
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Customers',
    tableName: 'Customers',
  });

  return Customers;
};