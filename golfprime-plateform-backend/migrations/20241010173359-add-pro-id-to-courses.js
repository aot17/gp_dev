'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Courses', 'pro_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Pros',  // Table name to reference
        key: 'pro_id',  // Foreign key in Pros
      },
      onDelete: 'CASCADE',  // Optional, cascade behavior on delete
      onUpdate: 'CASCADE',  // Optional, cascade behavior on update
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Courses', 'pro_id');
  }
};
