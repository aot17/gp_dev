'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GolfsPros extends Model {
    static associate(models) {
      // define association here
    }
  }
  GolfsPros.init({
    pro_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Pros',
        key: 'pro_id',
      },
      primaryKey: true,
    },
    golf_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Golfs',
        key: 'golf_id',
      },
      primaryKey: true, 
    }
  }, {
    sequelize,
    modelName: 'GolfsPros',
    tableName: 'GolfsPros', 
  });
  return GolfsPros;
};