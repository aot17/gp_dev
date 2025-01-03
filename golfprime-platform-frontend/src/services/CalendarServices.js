import axios from 'axios';

// Fetch available slots
export const fetchAvailableSlots = async (date, setAvailableSlots, setErrorMessage) => {
  try {
    const response = await axios.get('http://localhost:3000/availability/probackoffice', {
      params: { date: date.toISOString() },
      withCredentials: true,
    });
    setAvailableSlots(response.data.availability || []);
  } catch (error) {
    console.error('Error fetching slots:', error);
    setErrorMessage('Failed to fetch slots.');
  }
};

// Fetch Bookings
export const fetchBookings = async (setEvents, setErrorMessage) => {
  try {
    const response = await axios.get('http://localhost:3000/pro/bookings', { withCredentials: true });

    const bookings = response.data.map((booking) => ({
      id: booking.id,
      title: booking.title,
      start: new Date(booking.start),
      end: new Date(booking.end),
    }));

    setEvents(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    setErrorMessage('Failed to fetch bookings.');
  }
};

// Fetch Unavailabilities
export const fetchUnavailabilities = async (setEvents, setErrorMessage) => {
  try {
    const response = await axios.get('http://localhost:3000/unavailabilities/probackoffice', {
      withCredentials: true,
    });

    const unavailabilities = response.data.map((unavailability) => {
      const start = new Date(unavailability.Date_start);
      const end = new Date(unavailability.Date_end);

      const isFullDay =
        start.getHours() === 0 && start.getMinutes() === 0 &&
        end.getHours() === 23 && end.getMinutes() === 59;

      return {
        id: unavailability.id,
        title: `Unavailable: ${unavailability.reason}`,
        start,
        end,
        isFullDay,
        className: 'unavailability-event',
      };
    });

    setEvents((prevEvents) => [...prevEvents, ...unavailabilities]);
  } catch (error) {
    console.error('Error fetching unavailabilities:', error);
    setErrorMessage('Failed to fetch unavailabilities.');
  }
};
