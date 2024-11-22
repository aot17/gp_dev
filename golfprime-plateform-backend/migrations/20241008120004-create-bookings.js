'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Bookings', {
      booking_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Date_start: {
        type: Sequelize.DATE,
        allowNull: false
      },
      Date_end: {
        type: Sequelize.DATE,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('booked', 'cancelled', 'completed'),
        defaultValue: 'booked'
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Customers',
          key: 'customer_id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      pro_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Pros',
          key: 'pro_id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      golf_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Golfs',
          key: 'golf_id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      course_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Courses',
          key: 'course_id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Bookings');
  }
};
