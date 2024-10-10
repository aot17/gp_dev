'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bookings extends Model {
    static associate(models) {
      Bookings.belongsTo(models.Customers, {
        foreignKey: 'customer_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      Bookings.belongsTo(models.Pros, {
        foreignKey: 'pro_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      Bookings.belongsTo(models.Golfs, {
        foreignKey: 'golf_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      Bookings.belongsTo(models.Courses, {
        foreignKey: 'course_id',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      })
    }
  }
  Bookings.init({
    booking_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Date_start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Date_end: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('booked', 'cancelled', 'completed'),
      defaultValue: 'booked',
    },
  }, {
    sequelize,
    modelName: 'Bookings',
    tableName: 'Bookings',
  });

  return Bookings;
};
