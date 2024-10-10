'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GolfsPros', {
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
      pro_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Pros', // References the Pros table
          key: 'pro_id', // Foreign key to Pros
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
    await queryInterface.dropTable('GolfsPros');
  }
};
