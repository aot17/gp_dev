'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Unavailabilities extends Model {
    static associate(models) {
      Unavailabilities.belongsTo(models.Pros, {
        foreignKey: 'pro_id',
        onDelete: 'CASCADE',
      });
    }
  }

  Unavailabilities.init({
    unavail_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pro_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Pros',
        key: 'pro_id'
      }
    },
    Date_start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Date_end: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    reason: {
      type: DataTypes.ENUM('holidays', 'break', 'personal', 'other'),
      defaultValue: 'other',
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Unavailabilities',
    tableName: 'Unavailabilities',
  });

  return Unavailabilities;
};
