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

  module.exports = {toUTC};