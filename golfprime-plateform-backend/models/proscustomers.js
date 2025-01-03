'use strict';
const { 
  Model 
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProsCustomers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProsCustomers.belongsTo(models.Pros, { foreignKey: 'pro_id' });
      ProsCustomers.belongsTo(models.Customers, { foreignKey: 'customer_id' });    }
  }

  ProsCustomers.init(
    {
      relationship_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      },
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Customers',
          key: 'customer_id',
        },
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'ProsCustomers',
      tableName: 'ProsCustomers',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['pro_id', 'customer_id'],
        },
      ],
    }
  );

  return ProsCustomers;
};
