const { processAvailability } = require('../services/availabilityService');

exports.getAvailability = async (req, res) => {
  const { pro_id } = req.params;
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: 'Date is required' });
  }

  try {
    const selectedDate = new Date(date);
    if (isNaN(selectedDate)) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    const availability = await processAvailability(pro_id, selectedDate);
    res.json({ availability });
  } catch (error) {
    console.error('Error processing availability:', error);
    res.status(500).json({ message: 'Error processing availability', error });
  }
};
