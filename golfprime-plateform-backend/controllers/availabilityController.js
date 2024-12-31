const { processAvailability } = require('../services/availabilityService');

// Controller function to handle availability requests
exports.getAvailability = async (req, res) => {
  const { pro_id } = req.params; // Extract pro_id from the URL parameters.
  const { date } = req.query;// Extract date from the query parameters.

  // Validate that the required 'date' query parameter is provided.
  if (!date) {
    return res.status(400).json({ message: 'Date is required' });
  }

  try {
    // Convert the provided date string to a JavaScript Date object.
    const selectedDate = new Date(date);
    // Validate the date format.
    if (isNaN(selectedDate)) {
    // Check if the date conversion resulted in an invalid date.
      return res.status(400).json({ message: 'Invalid date format' });
    }

    // Process the availability using the service function.
    // Pass the pro_id and the selected date to the service.

    const availability = await processAvailability(pro_id, selectedDate);
    // Send the processed availability data back to the client in JSON format.
    res.json({ availability });
    
  } catch (error) {
    console.error('Error processing availability:', error);
    res.status(500).json({ message: 'Error processing availability', error });
  }
};

// Controller function for pro-specific availability
exports.getProAvailability = async (req, res) => {
  const proId = req.user.id; // Use logged-in pro ID from session
  const { date } = req.query; // Extract the date from query parameters

  if (!date) {
    return res.status(400).json({ message: 'Date is required' });
  }

  try {
    // Validate and parse the date
    const selectedDate = new Date(date);
    if (isNaN(selectedDate)) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    // Process availability for the logged-in pro
    const availability = await processAvailability(proId, selectedDate);
    res.json({ availability });
  } catch (error) {
    console.error('Error fetching pro availability:', error);
    res.status(500).json({ message: 'Failed to fetch availability.' });
  }
};

