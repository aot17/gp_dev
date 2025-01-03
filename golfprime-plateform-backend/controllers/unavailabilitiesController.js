const { Unavailabilities } = require('../models');
const { validateUnavailabilityDates } = require('../services/dateValidationService');
const { hasOverlappingBookings,hasOverlappingUnavailabilities } = require('../services/overlappingCheckService');

// Add a new unavailability for a pro
exports.addUnavailability = async (req, res) => {
  const { Date_start, Date_end, reason } = req.body;
  const pro_id = req.user.id; // Extract the pro_id from the authenticated user

  try {

    const { start, end } = validateUnavailabilityDates(Date_start, Date_end); 

    // Check for overlapping bookings
    const isBookingOverlap = await hasOverlappingBookings(pro_id, start, end);
    if (isBookingOverlap) {
      return res.status(400).json({
        message: 'Unavailability overlaps with an existing booking.',
      });
    }

    // Check for overlapping unavailabilities
    const isUnavailabilityOverlap = await hasOverlappingUnavailabilities(pro_id, start, end);
    if (isUnavailabilityOverlap) {
      return res.status(400).json({
        message: 'Unavailability overlaps with another unavailability.',
      });
    }

    // Create the unavailability
    const unavailability = await Unavailabilities.create({
      pro_id,
      Date_start: start,
      Date_end: end,
      reason,
    });

    res.status(201).json(unavailability); // Respond with the created record
  } catch (error) {
    console.error('Error adding unavailability:', error);
    res.status(500).json({ message: 'Failed to add unavailability', error: error.message });
  }
};

// Get all unavailabilities for the logged-in pro (pro back office)
exports.getProBackOfficeUnavailabilities = async (req, res) => {
  const pro_id = req.user.id; // Use authenticated user's ID
  try {
    const unavailabilities = await Unavailabilities.findAll({
      where: { pro_id },
      order: [['Date_start', 'ASC']],
    });
    res.json(unavailabilities);
  } catch (error) {
    console.error('Error fetching unavailabilities:', error);
    res.status(500).json({ message: 'Failed to retrieve unavailabilities' });
  }
};

// Get all unavailabilities for a specific pro
exports.getProUnavailabilities = async (req, res) => {
  const { pro_id } = req.params; // Get the pro_id from the route parameter

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
