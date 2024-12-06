const { Bookings, ProsCustomers } = require('../models');
const { processAvailability } = require('../services/availabilityService');
const { validateBookingDates } = require('../services/dateValidationService');

// Pro creates a booking
exports.createBooking = async (req, res) => {
  const { pro_id, customer_id, Date_start, Date_end } = req.body; // Extract booking details from the request body
  const requesterId = req.user.id; // Extract pro_id from the authenticated user session

  try {

    // Validate dates
    const { start, end } = validateBookingDates(Date_start, Date_end);

    // Validate that the pro is authorized to create bookings for themselves
    if (requesterId !== pro_id) {
      return res.status(403).json({ message: 'Pro can only create bookings on their own calendar.' });
    }

    // Check if the pro has a prior relationship with the client
    // Ensure that the pros can only create a booking with a client they’ve previously worked with
    const existingRelationship = await ProsCustomers.findOne({
      where: { pro_id: requesterId, customer_id }, // Check for an existing entry in ProsCustomers
    });

    if (!existingRelationship) {
      return res.status(403).json({
        message: 'Pro can only book for clients they have previously worked with.',
      });
    }

    // Validate the time slot
    // Ensure that the booking slot is available by fetching the pro's availability
    const availableSlots = await processAvailability(pro_id, start);
    console.log('Requested slot:', { start, end });

    const isAvailable = availableSlots.some(slot =>
        slot.Date_start.getTime() === start.getTime() &&
        slot.Date_end.getTime() === end.getTime()
    );

    if (!isAvailable) {
      return res.status(400).json({ message: 'Requested time slot is unavailable.' });
    }

    // Create the booking in the database
    const booking = await Bookings.create({
      pro_id,
      customer_id,
      Date_start: start,
      Date_end: end,
      status: 'booked',
    });

    // Respond with the newly created booking
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Failed to create booking.', error: error.message });
  }
};

// Pro updates an existing booking
exports.updateBooking = async (req, res) => {
  const bookingId = req.params.id; // Extract the booking_id from the request parameters
  const { Date_start, Date_end } = req.body; // Extract the new start and end dates from the request body
  const requesterId = req.user.id; // Extract the logged-in pro_id

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

    if (booking.pro_id !== requesterId) {
      return res.status(403).json({ message: 'Pro can only update their own bookings.' });
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

    // Check availability for the new dates
    const availableSlots = await processAvailability(requesterId, start);
    const isAvailable = availableSlots.some(
      (slot) =>
        slot.Date_start.getTime() === start.getTime() &&
        slot.Date_end.getTime() === end.getTime()
    );

      if (!isAvailable) {
        return res.status(400).json({ message: 'Requested time slot is unavailable.' });
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

// Pro deletes an existing booking
exports.deleteBooking = async (req, res) => {
  const bookingId = req.params.id; // Extract the booking_id from the request parameters
  const requesterId = req.user.id; // Extract the logged-in pro_id from the user session

  try {
    // Fetch the booking by ID
    const booking = await Bookings.findByPk(bookingId);

    // Validate the booking exists and belongs to the requester
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (booking.pro_id !== requesterId) {
      return res
        .status(403)
        .json({ message: 'Pro can only delete their own bookings.' });
    }

    // Delete the booking
    await booking.destroy();

    // Send success response
    res.json({ message: 'Booking deleted successfully.' });
  } catch (error) {
    console.error('Error deleting booking:', error); // Log the error for debugging
    res.status(500).json({ message: 'Failed to delete booking.', error: error.message });
  }
};