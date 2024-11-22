'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class WorkingHours extends Model {
    static associate(models) {
      // Define associations here
      WorkingHours.belongsTo(models.Pros, {
        foreignKey: 'pro_id',
        onDelete: 'CASCADE',
      });
    }
  }

  WorkingHours.init({
    working_hours_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pro_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    day_of_week: {
      type: DataTypes.ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
      allowNull: false,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'WorkingHours',
    tableName: 'WorkingHours',
  });

  return WorkingHours;
};
