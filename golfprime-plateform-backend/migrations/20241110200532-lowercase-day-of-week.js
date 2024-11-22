'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      UPDATE \`WorkingHours\`
      SET \`day_of_week\` = LOWER(\`day_of_week\`);
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the lowercase change if needed (optional)
    await queryInterface.sequelize.query(`
      UPDATE \`WorkingHours\`
      SET \`day_of_week\` = UPPER(LEFT(\`day_of_week\`, 1)) || LOWER(SUBSTRING(\`day_of_week\`, 2));
    `);
  }
};
