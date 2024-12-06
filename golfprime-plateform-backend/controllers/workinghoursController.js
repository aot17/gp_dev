const { WorkingHours } = require('../models');

// Add new working hours for a pro
exports.addWorkingHours = async (req, res) => {
  const { day_of_week, start_time, end_time } = req.body;
  const pro_id = req.user.id; // Extract the pro_id from the authenticated user

  try {
    // Create new working hours entry in the database
    const workingHours = await WorkingHours.create({ pro_id, day_of_week, start_time, end_time });
    res.status(201).json(workingHours); // Respond with the created working hours
  } catch (error) {
    console.error('Error adding working hours:', error);
    res.status(500).json({ message: 'Failed to add working hours' }); // Error handling
  }
};

// Get all working hours for a specific pro
exports.getProWorkingHours = async (req, res) => {
  const { pro_id } = req.params; // Get the pro ID from the route parameter

  try {
    // Retrieve all working hours for the specified pro, ordered by day of the week
    const workingHours = await WorkingHours.findAll({
      where: { pro_id },
      order: [['day_of_week', 'ASC']],
    });
    res.json(workingHours); // Respond with the list of working hours
  } catch (error) {
    console.error('Error fetching working hours:', error);
    res.status(500).json({ message: 'Failed to retrieve working hours' });
  }
};
