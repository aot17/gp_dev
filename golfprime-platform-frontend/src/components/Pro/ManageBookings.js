import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import axios from 'axios';
import './ManageBookings.css'; // Custom styles
import BookingModal from './BookingModal'; // Modal
import BookingForm from './BookingForm'; // Unified form

// Localization
const locales = {
  'en-US': require('date-fns/locale/en-US'), // Load locale for date-fns to format dates in US English
};

// Configure the localizer for react-big-calendar
const localizer = dateFnsLocalizer({
  format,         // Function to format dates (provided by date-fns)
  parse,          // Function to parse dates (provided by date-fns)
  startOfWeek,    // Defines the first day of the week (Sunday or Monday)
  getDay,         // Returns the day of the week (0 = Sunday, 1 = Monday, etc.)
  locales,        // Passes the defined locales
});

function ManageBookings() {
  // State
  const [events, setEvents] = useState([]); // Stores existing bookings as calendar events
  const [modalVisible, setModalVisible] = useState(false); // Controls modal visibility
  const [selectedSlot, setSelectedSlot] = useState(null); // Stores currently selected slot
  const [selectedDate, setSelectedDate] = useState(''); // Selected date for display in modal
  const [customers, setCustomers] = useState([]); // Stores list of customers for dropdown
  const [errorMessage, setErrorMessage] = useState(''); // Error messages for user feedback
  const [successMessage, setSuccessMessage] = useState(''); // Success messages for user feedback
  const [currentView, setCurrentView] = useState('month'); // Tracks the current calendar view
  const [availableSlots, setAvailableSlots] = useState([]); // Available slots for the selected date
  const [preSelectedSlot, setPreSelectedSlot] = useState(null); // Pre-selected slot for weekly/daily views

  // Fetch bookings
  useEffect(() => {
    axios
      .get('http://localhost:3000/pro/bookings', { withCredentials: true })
      .then((response) => {
        const bookings = response.data.map((booking) => ({
          id: booking.id,
          title: booking.title,
          start: new Date(booking.start),
          end: new Date(booking.end),
        }));
        setEvents(bookings);  // Store bookings in state
      })
      .catch((error) => console.error('Error fetching bookings:', error));
  }, []);

  // Fetch customers
  useEffect(() => {
    axios
      .get('http://localhost:3000/pro/customers', { withCredentials: true })
      .then((response) => setCustomers(response.data))
      .catch((error) => console.error('Error fetching customers:', error));
  }, []);

  // Fetch available slots
  const fetchAvailableSlots = (date) => {
    axios
      .get(`http://localhost:3000/availability/probackoffice`, {
        params: { date: date.toISOString() },
        withCredentials: true,
      })
      .then((response) => setAvailableSlots(response.data.availability || [])) // Populate available slots
      .catch((error) => {
        console.error('Error fetching slots:', error);
        setErrorMessage('Failed to fetch slots.');
      });
  };

  // Handle slot selection
  const handleSelectSlot = (slotInfo) => {
    console.log('Slot Info:', slotInfo);
    console.log('Current View:', currentView);

    const start = new Date(slotInfo.start);
    const end = new Date(slotInfo.end);

    if (currentView === 'month') {
      // Monthly View - Fetch slots by date
      setSelectedDate(start); // Set date
      fetchAvailableSlots(start); // Fetch slots
      setModalVisible(true); // Show modal
    } else {
      // Weekly/Daily View - Preselect the slot based on selection
      setSelectedDate(start); // Set the selected date
      fetchAvailableSlots(start); // Fetch available slots for the date

      // Preselect the clicked slot as a default selection
      setPreSelectedSlot({
        Date_start: start.toISOString(),
        Date_end: end.toISOString(),
      });

      setModalVisible(true); // Show modal
    }
  };

  // Save booking
  const handleSaveBooking = (booking) => {

    // Find customer name from the dropdown options
    const customer = customers.find((c) => c.id === booking.customer_id);

    axios
      .post('http://localhost:3000/pro/bookings', booking, { withCredentials: true })
      .then((response) => {
        setEvents((prevEvents) => [
          ...prevEvents,
          {
            id: response.data.id,
            title: `Client: ${customer ? customer.name : 'Unknown'}`,
            start: new Date(response.data.Date_start),
            end: new Date(response.data.Date_end),
          },
        ]);
        setModalVisible(false); // Close modal
        setSuccessMessage('Booking created successfully!'); // Show success message
      })
      .catch((error) => {
        console.error('Error saving booking:', error);
        setErrorMessage('Failed to create booking.'); // Show error message
      });
  };

  return (
    <div className="manage-bookings">
      <h2>Manage Bookings</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        step={60}
        timeslots={1}
        views={['month', 'week', 'day']}
        onView={(view) => setCurrentView(view)}
        style={{ height: 600, margin: '20px' }}
        onSelectSlot={handleSelectSlot}
      />

      {/* Modal */}
      {modalVisible && (
        <BookingModal visible={modalVisible} onClose={() => setModalVisible(false)}>
          <BookingForm
            selectedDate={selectedDate}
            preSelectedSlot={preSelectedSlot}
            availableSlots={availableSlots}
            customers={customers}
            handleSaveBooking={handleSaveBooking}
            setModalVisible={setModalVisible}
          />
        </BookingModal>
      )}
    </div>
  );
}

export default ManageBookings;
