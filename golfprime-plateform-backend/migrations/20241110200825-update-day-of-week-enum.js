'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the old ENUM
    await queryInterface.changeColumn('WorkingHours', 'day_of_week', {
      type: Sequelize.STRING,
    });

    // Add the new ENUM with lowercase values
    await queryInterface.changeColumn('WorkingHours', 'day_of_week', {
      type: Sequelize.ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert to the original ENUM if needed
    await queryInterface.changeColumn('WorkingHours', 'day_of_week', {
      type: Sequelize.STRING,
    });

    await queryInterface.changeColumn('WorkingHours', 'day_of_week', {
      type: Sequelize.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
      allowNull: false,
    });
  }
};
