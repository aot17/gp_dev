'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Unavailabilities', {
      unavail_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pro_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Pros',
          key: 'pro_id'
        },
        onDelete: 'CASCADE'
      },
      Date_start: {
        type: Sequelize.DATE,
        allowNull: false
      },
      Date_end: {
        type: Sequelize.DATE,
        allowNull: false
      },
      reason: {
        type: Sequelize.ENUM('holidays', 'break', 'personal', 'other'),
        allowNull: false,
        defaultValue: 'other'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Unavailabilities');
  }
};
