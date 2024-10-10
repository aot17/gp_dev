'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Golfs extends Model {
    static associate(models) {
      Golfs.belongsToMany(models.Pros, {
        through: models.GolfsPros,
        foreignKey: 'golf_id'
      });
      Golfs.belongsToMany(models.Customers, {
        through: models.GolfsCustomers,
        foreignKey: 'golf_id'
      });
      Golfs.hasMany(models.Bookings, {
        foreignKey: 'golf_id'
      })
    }
  }
  Golfs.init({
    golf_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false, 
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false, 
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
    modelName: 'Golfs',
    tableName: 'Golfs',
  });
  return Golfs;
};