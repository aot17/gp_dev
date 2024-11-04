const { Courses, Pros } = require('./models');  // Adjust path if necessary
const sequelize = require('./models').sequelize;

async function populateCourses() {
  try {
    await sequelize.sync({ force: false }); // Ensure tables are synced

    // Sample courses data
    const courses = [
      { course_name: 'Beginner Golf Course', course_type: 'beginner', price: 100.00, pro_id: 1 }, // Replace `pro_id` with valid Pro IDs
      { course_name: 'Advanced Golf Tactics', course_type: 'advanced', price: 200.00, pro_id: 2 }
    ];

    for (const courseData of courses) {
      await Courses.create(courseData);
      console.log(`Added course ${courseData.course_name}.`);
    }

    console.log('Courses population complete.');
  } catch (error) {
    console.error('Error populating courses:', error);
  } finally {
    await sequelize.close();
  }
}

populateCourses();
