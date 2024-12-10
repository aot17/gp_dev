const { Bookings } = require('../models');
const { processAvailability } = require('../services/availabilityService');
const { validateBookingDates } = require('../services/dateValidationService');

// Create a new booking
exports.createBooking = async (req, res) => {
  const { pro_id, Date_start, Date_end } = req.body; // Extract pro_id and the desired start and end times from the request body.
  const customer_id = req.user.id; // Assumes customer is logged in

  console.log('Received data from frontend:', { pro_id, Date_start, Date_end });

  try {
    // Validate dates
    const { start, end } = validateBookingDates(Date_start, Date_end);

    // Check if the booking request falls within an available slot
    const availableSlots = await processAvailability(pro_id, start);

    console.log('Requested slot:', { start: start, end: end });

    const isAvailable = availableSlots.some(slot =>
      slot.Date_start.getTime() === start.getTime() &&
      slot.Date_end.getTime() === end.getTime()
    );

    if (!isAvailable) {
      return res.status(400).json({ message: 'Requested time slot is unavailable.' });
    }

    // Create the booking in UTC if the slot is available
    const booking = await Bookings.create({
      pro_id,
      customer_id,
      Date_start: start,
      Date_end: end,
      status: 'booked',
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Failed to create booking.', error: error.message });
  }
};

// Update existing booking
exports.updateBooking = async (req, res) => {
  const bookingId = req.params.id; // Extract the booking_id from the request params
  const { Date_start, Date_end } = req.body; // Extract new dates from the request body
  const customerId = req.user.id; // Extract logged-in customer_id

  try {

    // Validate that both dates are provided
    if (!Date_start || !Date_end) {
      return res.status(400).json({ message: 'Date_start and Date_end are required.' });
    }

    // Fetch the booking and validate ownership
    const booking = await Bookings.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (booking.customer_id !== customerId) {
      return res
        .status(403)
        .json({ message: 'Customers can only update their own bookings.' });
    }

    // Disallow updates for past bookings
    const now = new Date();
    if (booking.Date_end < now) {
      return res
        .status(400)
        .json({ message: 'Past bookings cannot be updated.' });
    }

    // Validate the new dates
    const { start, end } = validateBookingDates(Date_start, Date_end);

    // Check availability of the new dates
    const availableSlots = await processAvailability(booking.pro_id, start);
    const isAvailable = availableSlots.some(
      (slot) =>
        slot.Date_start.getTime() === start.getTime() &&
        slot.Date_end.getTime() === end.getTime()
    );

      if (!isAvailable) {
        return res
          .status(400)
          .json({ message: 'Requested time slot is unavailable.' });
      }

    // Update the booking
    const updatedBooking = await booking.update({
      Date_start: start,
      Date_end: end,
    });

    res.json(updatedBooking); // Respond with the updated booking
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Failed to update booking.', error: error.message });
  }
};

// Delete existing booking
exports.deleteBooking = async (req, res) => {
  const bookingId = req.params.id; // Extract the booking_id from the request params
  const customerId = req.user.id; // Extract logged-in customer's ID

  try {
    // Fetch the booking and validate ownership
    const booking = await Bookings.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (booking.customer_id !== customerId) {
      return res
        .status(403)
        .json({ message: 'Customers can only delete their own bookings.' });
    }

    // Delete the booking
    await booking.destroy();
    res.json({ message: 'Booking deleted successfully.' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Failed to delete booking.', error: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const customerId = req.user.id; // Get the customer_id of the logged-in customer
    const bookings = await Bookings.findAll({
      where: { customer_id: customerId }, // Restrict to the logged-in customer
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve bookings.' });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const customerId = req.user.id; // Get the customer_id of the logged-in customer
    const booking = await Bookings.findOne({
      where: { booking_id: req.params.id }, // Fetch the booking by ID
    });

    // Check if booking exists
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    // Check if the booking belongs to the logged-in customer
    if (booking.customer_id !== customerId) {
      return res.status(403).json({ error: 'You do not have permission to view this booking.' });
    }

    // If everything checks out, return the booking
    res.json(booking);

  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve booking.' });
  }
};


