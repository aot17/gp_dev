'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add 'role' column to 'Authentication'
    await queryInterface.addColumn('Authentication', 'role', {
      type: Sequelize.ENUM('customer', 'pro', 'admin'),
      allowNull: false
    });

    // Add 'auth_id' column to 'Pros'
    await queryInterface.addColumn('Pros', 'auth_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Authentication',
        key: 'auth_id'
      },
      onDelete: 'CASCADE',
    });

    // Add 'auth_id' column to 'Customers'
    await queryInterface.addColumn('Customers', 'auth_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Authentication',
        key: 'auth_id'
      },
      onDelete: 'CASCADE',
    });

    // Remove 'pro_id' column from 'Authentication'
    await queryInterface.removeColumn('Authentication', 'pro_id');

    // Remove 'customer_id' column from 'Authentication'
    await queryInterface.removeColumn('Authentication', 'customer_id');
  },

  down: async (queryInterface, Sequelize) => {
    // Add 'pro_id' column back to 'Authentication'
    await queryInterface.addColumn('Authentication', 'pro_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Pros',
        key: 'pro_id'
      },
      onDelete: 'CASCADE',
    });

    // Add 'customer_id' column back to 'Authentication'
    await queryInterface.addColumn('Authentication', 'customer_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Customers',
        key: 'customer_id'
      },
      onDelete: 'CASCADE',
    });

    // Remove 'auth_id' from 'Customers'
    await queryInterface.removeColumn('Customers', 'auth_id');

    // Remove 'auth_id' from 'Pros'
    await queryInterface.removeColumn('Pros', 'auth_id');

    // Remove 'role' from 'Authentication'
    await queryInterface.removeColumn('Authentication', 'role');
  }
};
