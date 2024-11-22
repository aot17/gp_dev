const { Bookings } = require('../models');
const { processAvailability } = require('../services/availabilityService');
const { toUTC } = require('../services/dateService');

// Create a new booking with streamlined checks
exports.createBooking = async (req, res) => {
  const { pro_id, Date_start, Date_end } = req.body;
  const customer_id = req.user.userId; // Assumes customer is logged in

  try {
    // Convert incoming dates to UTC
    const start = toUTC(new Date(Date_start));
    const end = toUTC(new Date(Date_end));

    // Check if the booking request falls within an available slot
    const availableSlots = await processAvailability(pro_id, start);
    console.log('Requested slot:', { start, end });

    const isAvailable = availableSlots.some(slot =>
      slot.Date_start.getTime() === start.getTime() && slot.Date_end.getTime() === end.getTime()
    );

    if (!isAvailable) {
      return res.status(400).json({ message: 'Requested time slot is unavailable' });
    }

    // Create the booking in UTC if the slot is available
    const booking = await Bookings.create({
      pro_id,
      customer_id,
      Date_start: start,
      Date_end: end,
      status: 'booked'
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Failed to create booking', error: error.message });
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
