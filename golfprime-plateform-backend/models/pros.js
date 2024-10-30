'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pros extends Model {
    static associate(models) {
      Pros.belongsToMany(models.Golfs, {
        through: models.GolfsPros,
        foreignKey: 'pro_id'
      });
      Pros.hasMany(models.Bookings, {
        foreignKey: 'pro_id'
      });
      Pros.hasMany(models.Courses, {
        foreignKey: 'pro_id'
      });
      Pros.hasOne(models.Authentication, {
        foreignKey: 'pro_id',
        onDelete: 'CASCADE'
      })
    }
  }
  Pros.init({
    pro_id: {
      allowNull: false,
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
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Pros', 
    tableName: 'Pros', 
  });
  return Pros;
};