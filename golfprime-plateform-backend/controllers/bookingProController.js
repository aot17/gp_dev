const { Bookings, ProCustomers } = require('../models');
const { processAvailability } = require('../services/availabilityService');
const { toUTC } = require('../services/dateService');

// Pro creates a booking for a client they’ve previously worked with
exports.createBooking = async (req, res) => {
  const { pro_id, customer_id, Date_start, Date_end } = req.body;
  const requesterId = req.user.userId;

  try {
    // Convert incoming dates to UTC
    const [start, end] = toUTC(new Date(Date_start), new Date(Date_end));

    // Pro can only create bookings for themselves
    if (requesterId !== pro_id) {
      return res.status(403).json({ message: 'Pro can only create bookings on their own calendar' });
    }

    // Check if the pro has a prior relationship with this customer
    const existingRelationship = await ProCustomers.findOne({
      where: { pro_id: requesterId, customer_id },
    });

    if (!existingRelationship) {
      return res.status(403).json({ message: 'Pro can only book for clients they have previously worked with' });
    }

    // Check availability
    const availableSlots = await processAvailability(pro_id, start);
    console.log('Requested slot:', { start, end });
    const isAvailable = availableSlots.some(
      slot => slot.Date_start.getTime() === start.getTime() && slot.Date_end.getTime() === end.getTime()
    );

    if (!isAvailable) {
      return res.status(400).json({ message: 'Requested time slot is unavailable' });
    }

    // Create booking
    const booking = await Bookings.create({
      pro_id,
      customer_id,
      Date_start: start,
      Date_end: end,
      status: 'booked',
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create booking', error });
  }
};

// Pro-specific update and delete
exports.updateBooking = async (req, res) => {
  const bookingId = req.params.id;
  const { Date_start, Date_end } = req.body;
  const requesterId = req.user.userId;

  try {
    const booking = await Bookings.findByPk(bookingId);
    if (!booking || booking.pro_id !== requesterId) {
      return res.status(403).json({ message: 'Pro can only update their own bookings' });
    }

    // Convert dates to UTC if updating the start/end time
    const start = Date_start ? toUTC(new Date(Date_start)) : booking.Date_start;
    const end = Date_end ? toUTC(new Date(Date_end)) : booking.Date_end;

    // Re-check availability only if the dates have been modified
    if (Date_start || Date_end) {
      const availableSlots = await processAvailability(requesterId, start);
      const isAvailable = availableSlots.some(slot => 
        slot.Date_start.getTime() === start.getTime() && slot.Date_end.getTime() === end.getTime()
      );

      if (!isAvailable) {
        return res.status(400).json({ message: 'Requested time slot is unavailable' });
      }
    }

    // Update booking
    await booking.update({ Date_start: start, Date_end: end, ...req.body });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update booking', error });
  }
};

exports.deleteBooking = async (req, res) => {
  const bookingId = req.params.id;
  const requesterId = req.user.userId;

  try {
    const booking = await Bookings.findByPk(bookingId);
    if (!booking || booking.pro_id !== requesterId) {
      return res.status(403).json({ message: 'Pro can only delete their own bookings' });
    }

    await booking.destroy();
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete booking', error });
  }
};
