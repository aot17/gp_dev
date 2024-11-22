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
    // Pass the professional ID and the selected date to the service.

    const availability = await processAvailability(pro_id, selectedDate);
    // Send the processed availability data back to the client in JSON format.
    res.json({ availability });
    
  } catch (error) {
    console.error('Error processing availability:', error);
    res.status(500).json({ message: 'Error processing availability', error });
  }
};
