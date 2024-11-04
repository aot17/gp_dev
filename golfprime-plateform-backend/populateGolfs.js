const { Golfs } = require('./models');  // Adjust path if necessary
const sequelize = require('./models').sequelize;

async function populateGolfs() {
  try {
    await sequelize.sync({ force: false }); // Ensure tables are synced

    // Sample golf course data
    const golfCourses = [
      { name: 'Green Meadows Golf Club', address: '123 Golf Lane', email: 'info@greenmeadows.com', phone: '123-456-7890' },
      { name: 'Sunnyvale Golf Resort', address: '456 Sunny Road', email: 'contact@sunnyvalegolf.com', phone: '987-654-3210' }
    ];

    for (const golfData of golfCourses) {
      await Golfs.create(golfData);
      console.log(`Added golf course ${golfData.name}.`);
    }

    console.log('Golf courses population complete.');
  } catch (error) {
    console.error('Error populating golf courses:', error);
  } finally {
    await sequelize.close();
  }
}

populateGolfs();
