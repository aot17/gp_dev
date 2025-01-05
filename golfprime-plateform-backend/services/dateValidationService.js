const { toUTC } = require('./dateService'); // Import UTC conversion

/**
 * Validates booking dates
 *
 * @param {Date} Date_start - The desired start date/time.
 * @param {Date} Date_end - The desired end date/time.
 *
 * @returns {{start: Date, end: Date}} - Processed dates if valid.
 * @throws {Error} - Throws validation errors if dates are invalid.
 */
const validateBookingDates = (Date_start, Date_end) => {

  const start = new Date(Date_start);
  const end = new Date(Date_end);

  // Step 1: Validate date formats
  if (isNaN(start) || isNaN(end)) {
    throw new Error('Invalid date format. Please provide valid Date_start and Date_end.');
  }

  // Step 2: Validate that Date_start is earlier than Date_end
  if (start >= end) {
    throw new Error('Date_start must be earlier than Date_end.');
  }

  // Step 3: Validate that Date_start is in the future
  const now = new Date();
  if (start < now) {
    throw new Error('Date_start must be in the future.');
  }

  // Return processed UTC dates if validation passes
  return { start, end };
};

/**
 * Validates unavailabilities dates
 *
 * @param {Date} Date_start - The desired start date/time.
 * @param {Date} Date_end - The desired end date/time.
 *
 * @returns {{start: Date, end: Date}} - Processed dates if valid.
 * @throws {Error} - Throws validation errors if dates are invalid.
 */
const validateUnavailabilityDates = (Date_start, Date_end) => {

  const start = new Date(Date_start);
  const end = new Date(Date_end);

  // Step 1: Validate date formats
  if (isNaN(start) || isNaN(end)) {
    throw new Error('Invalid date format. Please provide valid starting and ending dates.');
  }

  // Step 2: Validate that Date_start is earlier than Date_end
  if (start >= end) {
    throw new Error('The starting date must be earlier than ending date.');
  }

  // Return processed UTC dates if validation passes
  return { start, end };
};

module.exports = {
  validateBookingDates, validateUnavailabilityDates,
};
