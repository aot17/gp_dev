'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GolfsCustomers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  GolfsCustomers.init({
    golf_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Golfs',
        key: 'golf_id',
      },
      primaryKey: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Customers',
        key: 'customer_id',
      },
      primaryKey: true,
    },
  }, {
    sequelize,
    modelName: 'GolfsCustomers',
    tableName: 'GolfsCustomers'
  });
  return GolfsCustomers;
};