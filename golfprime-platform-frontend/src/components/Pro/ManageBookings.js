import React, { useState } from 'react';
import axios from 'axios';
import CreateBookingForm from './CreateBookingForm'; // Form for bookings
import EditBookingForm from './EditBookingForm';

function ManageBookings({
  selectedDate,
  availableSlots,
  customers,
  preSelectedSlot,
  setEvents,
  setModalVisible,
  fetchEvents, // Pass fetchEvents to handle updates
  bookingId, // Optional: Used for editing or deleting
  existingBooking, // Optional: Pre-fill form when editing
  mode
}) {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // **Create Booking**
  const handleCreateBooking = (booking) => {
    axios
      .post('http://localhost:3000/pro/bookings', booking, { withCredentials: true })
      .then((response) => {
        // Add the new booking to the events
        setEvents((prevEvents) => [
          ...prevEvents,
          {
            id: response.data.id,
            title: `Client: ${
              customers.find((c) => c.id === booking.customer_id)?.name || 'Unknown'
            }`,
            start: new Date(response.data.Date_start),
            end: new Date(response.data.Date_end),
          },
        ]);
        setModalVisible(false); // Close modal
        setSuccessMessage('Booking created successfully!');
        fetchEvents(); // Refetch bookings to update the calendar
      })
      .catch((error) => {
        console.error('Error saving booking:', error);
        setErrorMessage('Failed to create booking.');
      });
  };

  // **Update Booking**
  const handleUpdateBooking = (booking) => {
    axios
      .put(`http://localhost:3000/pro/bookings/${bookingId}`, booking, { withCredentials: true })
      .then((response) => {
        // Update the existing booking in the events list
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === bookingId
              ? {
                  ...event,
                  start: new Date(response.data.Date_start),
                  end: new Date(response.data.Date_end),
                }
              : event
          )
        );
        setModalVisible(false); // Close modal
        setSuccessMessage('Booking updated successfully!');
      })
      .catch((error) => {
        console.error('Error updating booking:', error);
        setErrorMessage('Failed to update booking.');
      });
  };

  // **Delete Booking**
  const handleDeleteBooking = async () => {
    if (!bookingId) return; // No booking selected to delete

    try {
      await axios.delete(`http://localhost:3000/pro/bookings/${bookingId}`, {
        withCredentials: true,
      });

      // Remove deleted booking from events
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== bookingId));

      setModalVisible(false); // Close modal
      setSuccessMessage('Booking deleted successfully!');
    } catch (error) {
      console.error('Error deleting booking:', error);
      setErrorMessage('Failed to delete booking.');
    }
  };

  return (
    <div>
      {mode === 'create' ? (
        <CreateBookingForm
          selectedDate={selectedDate}
          handleCreateBooking={handleCreateBooking}
          preSelectedSlot={preSelectedSlot}
          availableSlots={availableSlots}
          customers={customers}
          setEvents={setEvents}
          setModalVisible={setModalVisible}
        />
      ) : (
        <EditBookingForm
          existingBooking={existingBooking}
          availableSlots={availableSlots}
          handleDeleteBooking={handleDeleteBooking}
          handleUpdateBooking={handleUpdateBooking}
          customers={customers}
          setEvents={setEvents}
          setModalVisible={setModalVisible}
        />
      )}
    </div>
  );
}

export default ManageBookings;
