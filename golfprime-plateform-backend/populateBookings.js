const { Bookings } = require('./models');  // Adjust path if necessary
const sequelize = require('./models').sequelize;

async function populateBookings() {
  try {
    await sequelize.sync({ force: false }); // Ensure tables are synced

    // Sample booking data
    const bookings = [
      {
        Date_start: new Date(2024, 10, 20, 9, 0, 0), // Nov 20, 2024, 9:00 AM
        Date_end: new Date(2024, 10, 20, 10, 0, 0),  // Nov 20, 2024, 10:00 AM
        status: 'booked',
        customer_id: 2,  // Replace with valid Customer IDs
        pro_id: 1,       // Replace with valid Pro IDs
        golf_id: 1,      // Replace with valid Golf IDs
        course_id: 1     // Replace with valid Course IDs
      },
      {
        Date_start: new Date(2024, 11, 5, 11, 0, 0), // Dec 5, 2024, 11:00 AM
        Date_end: new Date(2024, 11, 5, 12, 0, 0),  // Dec 5, 2024, 12:00 PM
        status: 'booked',
        customer_id: 1,
        pro_id: 2,
        golf_id: 2,
        course_id: 2
      }
    ];

    for (const bookingData of bookings) {
      await Bookings.create(bookingData);
      console.log(`Added booking for customer ID ${bookingData.customer_id}.`);
    }

    console.log('Bookings population complete.');
  } catch (error) {
    console.error('Error populating bookings:', error);
  } finally {
    await sequelize.close();
  }
}

populateBookings();
