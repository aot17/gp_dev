import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import axios from 'axios';
//import './ManageBookings.css';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function ManageBookings() {
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: '', start: null, end: null });

  useEffect(() => {
    axios
      .get('http://localhost:3000/pro/bookings', { withCredentials: true })
      .then((response) => {
        const bookings = response.data.map((booking) => ({
          id: booking.id,
          title: booking.title, // Title is correctly mapped from the backend
          start: new Date(booking.start), // Use "start" field from the backend
          end: new Date(booking.end), // Use "end" field from the backend
        }));
        setEvents(bookings);
      })
      .catch((error) => console.error('Error fetching bookings:', error));
  }, []);

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo);
    setModalVisible(true);
  };

  const handleSaveEvent = () => {
    const newBooking = {
      title: newEvent.title,
      start: selectedSlot.start,
      end: selectedSlot.end,
    };
    axios
      .post('http://localhost:3000/pro/bookings', newBooking, { withCredentials: true })
      .then((response) => {
        setEvents((prevEvents) => [...prevEvents, response.data]);
        setModalVisible(false);
      })
      .catch((error) => console.error('Error saving booking:', error));
  };

  const handleSelectEvent = (event) => {
    const confirmDelete = window.confirm('Delete this booking?');
    if (confirmDelete) {
      axios
        .delete(`http://localhost:3000/pro/bookings/${event.id}`, { withCredentials: true })
        .then(() => {
          setEvents((prevEvents) => prevEvents.filter((e) => e.id !== event.id));
        })
        .catch((error) => console.error('Error deleting booking:', error));
    }
  };

  return (
    <div className="manage-bookings">
      <h2>Manage Bookings</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        style={{ height: 600, margin: '20px' }}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
      />
      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create New Booking</h3>
            <label>Booking Title:</label>
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
            <button onClick={handleSaveEvent}>Save</button>
            <button onClick={() => setModalVisible(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageBookings;
