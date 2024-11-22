'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bookings extends Model {
    static associate(models) {
      Bookings.belongsTo(models.Customers, {
        foreignKey: 'customer_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      Bookings.belongsTo(models.Pros, {
        foreignKey: 'pro_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      Bookings.belongsTo(models.Golfs, {
        foreignKey: 'golf_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      Bookings.belongsTo(models.Courses, {
        foreignKey: 'course_id',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      })
    }
  }
  Bookings.init({
    booking_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pro_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    golf_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Date_start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Date_end: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('booked', 'cancelled', 'completed'),
      defaultValue: 'booked',
    },
  }, {
    sequelize,
    modelName: 'Bookings',
    tableName: 'Bookings',
  });

  Bookings.addHook('afterCreate', async (booking, options) => {
    const { golf_id, customer_id, pro_id } = booking;
  
    if (golf_id && customer_id) {
      // Populate GolfsCustomers table
      const GolfsCustomers = sequelize.models.GolfsCustomers;
      await GolfsCustomers.findOrCreate({
        where: { golf_id, customer_id },
        defaults: { golf_id, customer_id },
      });
    }
  
    if (golf_id && pro_id) {
      // Populate GolfsPros table
      const GolfsPros = sequelize.models.GolfsPros;
      await GolfsPros.findOrCreate({
        where: { golf_id, pro_id },
        defaults: { golf_id, pro_id },
      });
    }
  
    if (pro_id && customer_id) {
      // Populate ProsCustomers table
      const ProsCustomers = sequelize.models.ProsCustomers;
      await ProsCustomers.findOrCreate({
        where: { pro_id, customer_id },
        defaults: { pro_id, customer_id },
      });
    }
  });
  

  return Bookings;
};
