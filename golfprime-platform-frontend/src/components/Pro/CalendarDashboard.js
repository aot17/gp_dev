import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import BookingModal from './BookingModal';
import ManageBookings from './ManageBookings';
import ManageUnavailabilities from './ManageUnavailabilities';
import {
  fetchAvailableSlots,
  fetchBookings,
  fetchUnavailabilities,
} from '../../services/CalendarServices';

// Localization
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

function CalendarDashboard() {
  // State
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');
  const [events, setEvents] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [preSelectedSlot, setPreSelectedSlot] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null); // 'booking', 'editBooking', 'unavailability'
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Fetch events (Fix: Added fetchEvents as a function here)
  const fetchEvents = async () => {
    try {
      await fetchBookings(setEvents, setErrorMessage);
      await fetchUnavailabilities(setEvents, setErrorMessage);
    } catch (error) {
      console.error('Error fetching events:', error);
      setErrorMessage('Failed to fetch events.');
    }
  };

  useEffect(() => {
    fetchEvents(); // Fetch events when the component loads
  }, []);

  // Fetch customers
  useEffect(() => {
    axios
      .get('http://localhost:3000/pro/customers', { withCredentials: true })
      .then((response) => setCustomers(response.data))
      .catch((error) => console.error('Error fetching customers:', error));
  }, []);

  useEffect(() => {
    fetchEvents(); // Fetch events when the component loads
  }, []);

  // Handle slot selection (CREATE)
  const handleSelectSlot = async (slotInfo) => {
    const start = new Date(slotInfo.start);
    const end = new Date(slotInfo.end);

    setModalType(null);
    setSelectedDate(start);

    if (currentView === 'month') {
      await fetchAvailableSlots(start, setAvailableSlots, setErrorMessage);
      setPreSelectedSlot(null); // Clear pre-selection for monthly view
    } else {
      await fetchAvailableSlots(start, setAvailableSlots, setErrorMessage);
      setPreSelectedSlot({
        Date_start: start.toISOString(),
        Date_end: end.toISOString(),
      });
    }

    setModalType('booking'); // Set modal for booking creation
    setModalVisible(true);
  };

  // Handle event selection (EDIT)
  const handleSelectEvent = (event) => {
    console.log('Selected Event:', event); // Debug log to verify the selected event
    setModalType('editBooking');
    setSelectedBooking({
      id: event.id,
      Date_start: event.start.toISOString(),
      Date_end: event.end.toISOString(),
    }); // Pass selected event data
    setModalVisible(true);
  };

  // Event styles
  const eventStyleGetter = (event) => {
    const backgroundColor = event.className === 'unavailability-event' ? 'gray' : '#3174ad';
    return {
      style: {
        backgroundColor,
        color: 'white',
        borderRadius: '4px',
        padding: '4px',
        border: `1px solid ${backgroundColor}`,
      },
    };
  };

  return (
    <div className="calendar-dashboard">
      <h2>Manage Bookings and Unavailabilities</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        views={['month', 'week', 'day']}
        style={{ height: 600, margin: '20px' }}
        onView={(view) => setCurrentView(view)}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent} // Handle event selection for editing
        eventPropGetter={eventStyleGetter}
      />

      {/* Modal */}
      {modalVisible && (
        <BookingModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setModalType(null);
            setSelectedBooking(null);
          }}
        >
          {modalType === 'booking' && (
            <ManageBookings
              selectedDate={selectedDate}
              preSelectedSlot={preSelectedSlot}
              availableSlots={availableSlots}
              customers={customers}
              setEvents={setEvents}
              setModalVisible={setModalVisible}
              fetchEvents={fetchEvents} // Pass fetchEvents to handle updates
              mode="create"
            />
          )}

          {modalType === 'editBooking' && selectedBooking && (
            <ManageBookings
              selectedDate={new Date(selectedBooking.start)}
              availableSlots={availableSlots}
              customers={customers}
              setEvents={setEvents}
              setModalVisible={setModalVisible}
              bookingId={selectedBooking.id}
              existingBooking={selectedBooking}
              fetchEvents={fetchEvents} // Pass fetchEvents to handle updates
              mode="edit"
            />
          )}

          {modalType === 'unavailability' && (
            <ManageUnavailabilities
              selectedDate={selectedDate}
              setEvents={setEvents}
              setModalVisible={setModalVisible}
            />
          )}
        </BookingModal>
      )}
    </div>
  );
}

export default CalendarDashboard;
