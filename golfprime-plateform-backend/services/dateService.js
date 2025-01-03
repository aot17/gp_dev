  /**
 * Converts a given date to UTC.
 * @param {Date} date - The date to convert.
 * @returns {Date} A new Date object in UTC.
 */
function toUTC(date) {
    return new Date(Date.UTC(
      date.getFullYear(), 
      date.getMonth(), 
      date.getDate(), 
      date.getHours(), 
      date.getMinutes(), 
      date.getSeconds()
    ));
  }

/**
 * Converts a TIME string to a UTC Date object for a given date.
 * 
 * @param {string} time - The TIME string (e.g., "09:00:00").
 * @param {Date} date - The reference date (e.g., "2024-12-25").
 * @returns {Date} - A Date object in UTC.
 */
function timeToUTC(time, date) {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  const localDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes,
    seconds || 0
  );

  const utcDate = new Date(localDate.toISOString());
  return utcDate;
}


  module.exports = {toUTC, timeToUTC};