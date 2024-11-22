const processAvailability = (workingHours, unavailabilities, selectedDate) => {
  console.log('Processing availability for date:', selectedDate); // Debug
  console.log('Working hours:', workingHours); // Debug
  console.log('Unavailabilities:', unavailabilities); // Debug

  const dayOfWeek = selectedDate.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
  console.log('Day of week:', dayOfWeek); // Debug

  const hoursForDay = workingHours.find(wh => wh.day_of_week.toLowerCase() === dayOfWeek.toLowerCase());
  if (!hoursForDay) {
    console.log('No working hours found for this day.');
    return [];
  }

  const workingStart = new Date(selectedDate);
  workingStart.setHours(...hoursForDay.start_time.split(':').map(Number));
  const workingEnd = new Date(selectedDate);
  workingEnd.setHours(...hoursForDay.end_time.split(':').map(Number));

  console.log('Working start:', workingStart); // Debug
  console.log('Working end:', workingEnd); // Debug

  const slots = [];
  let currentStart = new Date(workingStart);

  while (currentStart < workingEnd) {
    const slotStart = new Date(currentStart);
    const slotEnd = new Date(slotStart);
    slotEnd.setHours(slotStart.getHours() + 1); // Example: 1-hour slots

    console.log(`Generated slot: ${slotStart} - ${slotEnd}`); // Debug

    const isUnavailable = unavailabilities.some(unavail => {
      const unavailStart = new Date(unavail.Date_start);
      const unavailEnd = new Date(unavail.Date_end);
      return (slotStart < unavailEnd && slotEnd > unavailStart);
    });

    if (!isUnavailable) {
      slots.push({ Date_start: new Date(slotStart), Date_end: new Date(slotEnd) });
    }

    currentStart = slotEnd;
  }

  console.log('Generated slots:', slots); // Debug
  return slots;
};

export default processAvailability;
