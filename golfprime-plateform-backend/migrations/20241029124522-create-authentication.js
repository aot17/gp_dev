'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Authentication', {
      auth_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Customers',
          key: 'customer_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      pro_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Pros',
          key: 'pro_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      hashed_password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Authentication');
  }
};
