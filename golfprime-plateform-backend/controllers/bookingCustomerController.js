const { Bookings } = require('../models');
const { processAvailability } = require('../services/availabilityService');
const { toUTC } = require('../services/dateService');

// Create a new booking with streamlined checks and validations
exports.createBooking = async (req, res) => {
  const { pro_id, Date_start, Date_end } = req.body; // Extract pro_id and the desired start and end times from the request body.
  const customer_id = req.user.id; // Assumes customer is logged in

  try {
    // Convert incoming dates to JavaScript Date objects
    const start = new Date(Date_start);
    const end = new Date(Date_end);

    // Validate that both dates are valid
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: 'Invalid date format. Please provide valid Date_start and Date_end.' });
    }

    // Validate that Date_start is earlier than Date_end
    if (start >= end) {
      return res.status(400).json({ message: 'Date_start must be earlier than Date_end.' });
    }

    // Validate that Date_start is in the future
    const now = new Date();
    if (start < now) {
      return res.status(400).json({ message: 'Date_start must be in the future.' });
    }

    // Convert dates to UTC for consistent time comparisons
    const utcStart = toUTC(start);
    const utcEnd = toUTC(end);

    // Check if the booking request falls within an available slot
    const availableSlots = await processAvailability(pro_id, utcStart);
    console.log('Requested slot:', { start: utcStart, end: utcEnd });

    const isAvailable = availableSlots.some(slot =>
      slot.Date_start.getTime() === utcStart.getTime() &&
      slot.Date_end.getTime() === utcEnd.getTime()
    );

    if (!isAvailable) {
      return res.status(400).json({ message: 'Requested time slot is unavailable.' });
    }

    // Create the booking in UTC if the slot is available
    const booking = await Bookings.create({
      pro_id,
      customer_id,
      Date_start: utcStart,
      Date_end: utcEnd,
      status: 'booked',
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Failed to create booking.', error: error.message });
  }
};

// Retrieve all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Bookings.findAll();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve bookings.' });
  }
};

// Retrieve a specific booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Bookings.findByPk(req.params.id);
    if (booking) {
      res.json(booking);
    } else {
      res.status(404).json({ error: 'Booking not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve booking.' });
  }
};

// Update a specific booking
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Bookings.findByPk(req.params.id);
    if (booking) {
      await booking.update(req.body);
      res.json(booking);
    } else {
      res.status(404).json({ error: 'Booking not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update booking.' });
  }
};

// Delete a specific booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Bookings.findByPk(req.params.id);
    if (booking) {
      await booking.destroy();
      res.json({ message: 'Booking deleted.' });
    } else {
      res.status(404).json({ error: 'Booking not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete booking.' });
  }
};
