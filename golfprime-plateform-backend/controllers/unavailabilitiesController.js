// controllers/unavailabilitiesController.js
const { Unavailabilities } = require('../models');

// Add a new unavailability for a pro
exports.addUnavailability = async (req, res) => {
  const { Date_start, Date_end, reason } = req.body;
  const pro_id = req.user.userId; // Extract the pro ID from the authenticated user

  try {
    // Create a new unavailability record in the database
    const unavailability = await Unavailabilities.create({ pro_id, Date_start, Date_end, reason });
    res.status(201).json(unavailability); // Respond with the created record
  } catch (error) {
    console.error('Error adding unavailability:', error);
    res.status(500).json({ message: 'Failed to add unavailability' }); // Error handling
  }
};

// Get all unavailabilities for a specific pro
exports.getProUnavailabilities = async (req, res) => {
  const { pro_id } = req.params; // Get the pro ID from the route parameter

  try {
    // Retrieve all unavailabilities for the specified pro, ordered by `Date_start`
    const unavailabilities = await Unavailabilities.findAll({
      where: { pro_id },
      order: [['Date_start', 'ASC']],
    });
    res.json(unavailabilities); // Respond with the list of unavailabilities
  } catch (error) {
    console.error('Error fetching unavailabilities:', error);
    res.status(500).json({ message: 'Failed to retrieve unavailabilities' });
  }
};
