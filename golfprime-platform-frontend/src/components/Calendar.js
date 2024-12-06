import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Initialize the localizer for moment
const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [events, setEvents] = useState([
    {
      title: 'Sample Booking',
      start: new Date(2024, 11, 27, 10, 0), // Dec 27, 2024, 10:00 AM
      end: new Date(2024, 11, 27, 11, 0), // Dec 27, 2024, 11:00 AM
    },
  ]);

  const handleSelectSlot = ({ start, end }) => {
    const title = window.prompt('Enter the event title:');
    if (title) {
      setEvents((prevEvents) => [
        ...prevEvents,
        { start, end, title },
      ]);
    }
  };

  const handleSelectEvent = (event) => {
    alert(`Event: ${event.title}`);
  };

  return (
    <div style={{ height: '80vh', padding: '20px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
      />
    </div>
  );
};

export default CalendarComponent;
