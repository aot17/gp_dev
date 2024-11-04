const { Pros, WorkingHours, Unavailabilities, sequelize } = require('./models'); // Adjust the path as needed

async function populateData() {
  try {
    await sequelize.sync({ force: false }); // Ensure tables are synced without dropping them

    // Sample data for Pros (if not already populated)
    const pro = await Pros.findOne({ where: { email: 'alice.smith@example.com' } });

    // Populate WorkingHours
    const workingHoursData = [
      { pro_id: pro.pro_id, day_of_week: 'monday', start_time: '09:00', end_time: '17:00' },
      { pro_id: pro.pro_id, day_of_week: 'tuesday', start_time: '09:00', end_time: '17:00' },
      { pro_id: pro.pro_id, day_of_week: 'wednesday', start_time: '09:00', end_time: '17:00' },
      { pro_id: pro.pro_id, day_of_week: 'thursday', start_time: '09:00', end_time: '17:00' },
      { pro_id: pro.pro_id, day_of_week: 'friday', start_time: '09:00', end_time: '17:00' }
    ];

    for (const wh of workingHoursData) {
      await WorkingHours.create(wh);
    }

    console.log('WorkingHours populated.');

    // Populate Unavailabilities
    const unavailabilitiesData = [
      { pro_id: pro.pro_id, Date_start: new Date('2024-12-25 09:00:00'), Date_end: new Date('2024-12-25 17:00:00'), reason: 'holidays' },
      { pro_id: pro.pro_id, Date_start: new Date('2024-11-10 12:00:00'), Date_end: new Date('2024-11-10 13:00:00'), reason: 'break' }
    ];

    for (const ua of unavailabilitiesData) {
      await Unavailabilities.create(ua);
    }

    console.log('Unavailabilities populated.');

  } catch (error) {
    console.error('Error populating data:', error);
  } finally {
    await sequelize.close();
  }
}

populateData();
