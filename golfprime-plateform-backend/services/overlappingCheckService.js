const { Op } = require('sequelize');
const { Bookings, Unavailabilities } = require('../models');

/**
 * Checks for overlapping events, allowing adjacent times without conflicts.
 * @param {number} pro_id - The pro ID.
 * @param {Date} start - The start date.
 * @param {Date} end - The end date.
 * @param {object} model - The database model to query (Bookings or Unavailabilities).
 * @returns {Promise<boolean>} - True if there are overlapping events.
 */
const hasOverlappingEvents = async (pro_id, start, end, model) => {
  const overlappingEvent = await model.findOne({
    where: {
      pro_id,
      [Op.or]: [
        // 1. New start is inside an existing event (excluding exact end match)
        {
          Date_start: { [Op.lt]: end },
          Date_end: { [Op.gt]: start },
        },

        // 2. Existing event completely overlaps the new event
        {
          [Op.and]: [
            { Date_start: { [Op.lte]: start } },
            { Date_end: { [Op.gte]: end } },
          ],
        },

        // 3. New event completely overlaps an existing event
        {
          [Op.and]: [
            { Date_start: { [Op.gte]: start } },
            { Date_end: { [Op.lte]: end } },
          ],
        },
      ],
    },
  });

  return !!overlappingEvent; // Returns true if a conflict exists
};

/**
 * Checks for overlapping bookings, allowing adjacent times.
 * @param {number} pro_id - The pro ID.
 * @param {Date} start - The start date.
 * @param {Date} end - The end date.
 * @returns {Promise<boolean>} - True if there are overlapping bookings.
 */
const hasOverlappingBookings = async (pro_id, start, end) => {
  return hasOverlappingEvents(pro_id, start, end, Bookings);
};

/**
 * Checks for overlapping unavailabilities, allowing adjacent times.
 * @param {number} pro_id - The pro ID.
 * @param {Date} start - The start date.
 * @param {Date} end - The end date.
 * @returns {Promise<boolean>} - True if there are overlapping unavailabilities.
 */
const hasOverlappingUnavailabilities = async (pro_id, start, end) => {
  return hasOverlappingEvents(pro_id, start, end, Unavailabilities);
};

// Export the functions
module.exports = {
  hasOverlappingBookings,
  hasOverlappingUnavailabilities,
};
