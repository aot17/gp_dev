'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GolfsCustomers', {
      golf_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Golfs', // References the Golfs table
          key: 'golf_id', // Foreign key to Golfs
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        primaryKey: true, // Composite primary key
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Customers', // References the Customers table
          key: 'customer_id', // Foreign key to Customers
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        primaryKey: true, // Composite primary key
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('GolfsCustomers');
  }
};
