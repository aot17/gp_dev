'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Courses extends Model {
    static associate(models) {
      Courses.belongsTo(models.Pros, {
        foreignKey: 'pro_id',
        onDelete: 'CASCADE'
      });
      Courses.hasMany(models.Bookings, {
        foreignKey: 'course_id'
      })
    }
  }
  Courses.init({
    course_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    course_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    course_type: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
      defaultValue: 'beginner',
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    pro_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Pros',
        key: 'pro_id',
      },
      onDelete: 'CASCADE',
    }
  }, {
    sequelize,
    modelName: 'Courses',
    tableName: 'Courses',
  });

  return Courses;
};