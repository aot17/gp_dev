const { WorkingHours, Bookings, Unavailabilities } = require('../models');
const { Op } = require('sequelize');
const { timeToUTC } = require('../services/dateService');


/**
 * Processes availability for a given date and pro by checking working hours,
 * existing bookings, and unavailabilities.
 *
 * @param {number} proId - The ID of the pro.
 * @param {Date} selectedDate - The date to check availability for.
 * @returns {Array} An array of available time slots.
 */
async function processAvailability(proId, selectedDate) {
  // Fetch working hours, bookings, and unavailabilities for this pro
  const workingHours = await getWorkingHours(proId, selectedDate);
  const bookings = await getBookings(proId, selectedDate);
  const unavailabilities = await getUnavailabilities(proId, selectedDate);

  console.log(`Working hours: ${JSON.stringify(workingHours)}`);
  console.log(`Bookings on ${selectedDate.toISOString()}: ${JSON.stringify(bookings)}`);
  console.log(`Unavailabilities on ${selectedDate.toISOString()}: ${JSON.stringify(unavailabilities)}`);

  // Logic to process availability based on working hours, bookings, and unavailabilities
  const availableSlots = calculateSlots(workingHours, bookings, unavailabilities, selectedDate);

  console.log(`Available slots :`, availableSlots);

  return availableSlots;
}

/**
 * Fetches the working hours for a pro on a specific day of the week.
 * 
 * @param {number} proId - The ID of the pro.
 * @param {Date} date - The date to check.
 * @returns {Object} An object representing start and end times of the working day.
 */
async function getWorkingHours(proId, date) {
    // `toLocaleString` formats the date to show the day name (like "Monday").
    // We specify 'en-US' for the locale to ensure consistency in day names.
    // We call `.toLowerCase()` to ensure the day string is in lowercase to match the database format.
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
    //console.log(`Fetching working hours for pro_id: ${proId}, dayOfWeek: ${dayOfWeek}`);
    const workingHour = await WorkingHours.findOne({
      where: {
        pro_id: proId,
        day_of_week: dayOfWeek
      },
      attributes: ['start_time', 'end_time']
    });

    // Check if a `workingHour` entry was found in the database.
    // If `workingHour` is null or undefined, return `null` to indicate that no working hours were found for that day.
    if (!workingHour) return null;

    // If a `workingHour` entry was found, return an object with `start` and `end` properties.
    // `start` is assigned the value of `workingHour.start_time`, and `end` is assigned `workingHour.end_time`.
    // This object will contain the working hours (start and end times) for the given pro on the specified day.

    const start = workingHour.start_time;
    const end = workingHour.end_time;

    // Log working hours before returning
    //console.log(`Working hours for pro_id: ${proId}, dayOfWeek: ${dayOfWeek}, start: ${start}, end: ${end}`); 

    return { start, end };
  }  

/**
 * Fetches bookings for a pro on a specific date.
 * 
 * @param {number} proId - The ID of the pro.
 * @param {Date} date - The date to check.
 * @returns {Array} An array of existing booking time ranges.
 */
async function getBookings(proId, date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0); // Set to midnight at the beginning of the day.
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999); // Set to just before midnight at the end of the day.
  
    console.log(`Start of the day of getBookings: ${startOfDay}, end of the day: ${endOfDay}`);

    // Query the `Bookings` table to find all bookings that match the conditions
    const bookings = await Bookings.findAll({
      where: {
        pro_id: proId,
        Date_start: { [Op.between]: [startOfDay, endOfDay] } // Date_start is within the day range.
      },
      attributes: ['Date_start', 'Date_end']
    });
  
    // Map the `bookings` array to return a simplified list of booking objects.
    // Each booking object in the array will have:
    // - A `start` property set to the booking's `Date_start` as a JavaScript Date object.
    // - An `end` property set to the booking's `Date_end` as a JavaScript Date object.
    return bookings.map(booking => ({
      start: new Date(booking.Date_start),
      end: new Date(booking.Date_end)
    }));
  }
  
/**
 * Fetches unavailabilities for a pro on a specific date.
 * 
 * @param {number} proId - The ID of the pro.
 * @param {Date} date - The date to check.
 * @returns {Array} An array of unavailable time ranges.
 */
async function getUnavailabilities(proId, date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
  
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
  
    console.log(`Start of the day of getUnavailabilities: ${startOfDay}, end of the day: ${endOfDay}`);

    const unavailabilities = await Unavailabilities.findAll({
      where: {
        pro_id: proId,
        [Op.or]: [
          {
            // Unavailability starts before or during the day and ends after the start of the day
            Date_start: { [Op.lte]: endOfDay },
            Date_end: { [Op.gte]: startOfDay },
          },
          {
            // Unavailability fully overlaps the day
            [Op.and]: [
              { Date_start: { [Op.lte]: startOfDay } },
              { Date_end: { [Op.gte]: endOfDay } },
            ],
          },
        ],
      },
      attributes: ['Date_start', 'Date_end']
    });

    console.log(`Unavailabilities fetched: ${JSON.stringify(unavailabilities)}`);
  
    return unavailabilities.map(unavail => ({
      start: new Date(unavail.Date_start),
      end: new Date(unavail.Date_end),
    }));
  }

/**
 * Checks for conflicts within a given time slot based on specified conditions.
 * 
 * @param {Date} slotStart - The start time of the slot being checked.
 * @param {Date} slotEnd - The end time of the slot being checked.
 * @param {Array} intervals - An array of time intervals (bookings, unavailabilities, etc.), 
 *                            where each interval has `start` and `end` Date objects.
 * @param {Object} options - Optional parameters to configure additional checks.
 * @param {boolean} [options.disallowPast=false] - If true, disallows time slots that end in the past.
 * @param {Date} [options.now=new Date()] - A reference date for checking past slots (useful for testing).
 * 
 * @returns {boolean} Returns true if there is any conflict with the given conditions; false otherwise.
 *                    Conflicts include overlapping with existing intervals or, if specified, being in the past.
 */

function checkTimeConflict(slotStart, slotEnd, intervals = [], options = {}) {
  const { disallowPast = false, now = new Date() } = options;

  // Check if the slot is in the past, based on the `disallowPast` option.
  if (disallowPast && slotEnd <= now) {
    console.log(`Conflict: Slot is in the past: ${slotStart.toISOString()} - ${slotEnd.toISOString()}`);
      return true;
  }

  // Check for overlap with any interval in the `intervals` array.
  for (let interval of intervals) {
    if (slotStart < interval.end && slotEnd > interval.start) {
      console.log(`Conflict: Overlapping with interval ${interval.start.toISOString()} - ${interval.end.toISOString()}`);
      return true;
    }
  }

  // No conflicts found, return false.
  return false;
}

/**
 * Calculates available slots for a given day based on working hours, bookings, and unavailabilities.
 * 
 * @param {Object} workingHours - Object with `start` and `end` properties representing the working hours.
 * @param {Array} bookings - Array of existing booking time ranges, where each booking has `start` and `end` Date objects.
 * @param {Array} unavailabilities - Array of unavailable time ranges, with each having `start` and `end` Date objects.
 * @param {Date} date - The date to check availability for.
 * @param {number} [slotDuration=60] - The duration of each time slot in minutes (default is 60 minutes).
 * @returns {Array} An array of available time slots, each with `Date_start` and `Date_end`.
 */
function calculateSlots(workingHours, bookings, unavailabilities, date, slotDuration = 60) {
  // If there are no working hours provided, return an empty array as there are no available slots.
  if (!workingHours) return []; 

  // Initialize an empty array to hold the available slots for the day.
  const slots = [];

  // Convert workingHours to UTC Date objects
  let currentStart = timeToUTC(workingHours.start, date);
  const workingEnd = timeToUTC(workingHours.end, date);
  
  console.log(`date calculateStols: ${date.toISOString()}`);
  console.log(`currentStart calculateSlots (UTC): ${currentStart.toISOString()}`);
  console.log(`workingEnd calculateSlots (UTC): ${workingEnd.toISOString()}`);

  // Create a `currentStart` Date object set to the start of the working hours on the specified `date`.
  //let currentStart = new Date(date);
  //currentStart.setHours(...workingHours.start.split(':').map(Number)); // Set hours to the start time of the working hours.

  // Create a `workingEnd` Date object set to the end of the working hours on the specified `date`.
  //const workingEnd = new Date(date);
  //workingEnd.setHours(...workingHours.end.split(':').map(Number)); // Set hours to the end time of the working hours.

  const now = new Date(); // Current date and time for checking past slots.

  // Loop to create time slots until `currentStart` reaches `workingEnd`.
  while (currentStart < workingEnd) {
      // Define the start and end of the current slot.
      const slotStart = new Date(currentStart);
      const slotEnd = new Date(slotStart);

      // Calculate slot end by adding the slotDuration
      slotEnd.setMinutes(slotStart.getMinutes() + slotDuration);

      console.log(`Checking slot: ${slotStart.toISOString()} - ${slotEnd.toISOString()}`);

      // Ensure the slot does not exceed the workingEnd time
      if (slotEnd > workingEnd) break;

      const isPastConflict = checkTimeConflict(slotStart, slotEnd, [], { disallowPast: true, now });
      const isBookingConflict = checkTimeConflict(slotStart, slotEnd, bookings);
      const isUnavailabilityConflict = checkTimeConflict(slotStart, slotEnd, unavailabilities);
  
      if (isPastConflict) {
        console.log(`Conflict detected: Slot is in the past (${slotStart.toISOString()} - ${slotEnd.toISOString()})`);
      }
      if (isBookingConflict) {
        console.log(`Conflict detected: Slot overlaps with an existing booking (${slotStart.toISOString()} - ${slotEnd.toISOString()})`);
      }
      if (isUnavailabilityConflict) {
        console.log(`Conflict detected: Slot overlaps with an unavailability (${slotStart.toISOString()} - ${slotEnd.toISOString()})`);
      }
  
      if (!isPastConflict && !isBookingConflict && !isUnavailabilityConflict) {
        slots.push({ Date_start: new Date(slotStart), Date_end: new Date(slotEnd) });
        console.log(`Slot added: ${slotStart.toISOString()} - ${slotEnd.toISOString()}`);
      } else {
        console.log("Slot not available");
      }
  
      currentStart = slotEnd;
    }
  
    return slots;
}
  
  module.exports = {
    processAvailability, getWorkingHours,
  };
