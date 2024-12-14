import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import DateSelector from '../components/Bookings/DateSelector';
import AvailableSlots from '../components/Bookings/AvailableSlots';
import './UpdateBookingPage.css'; // CSS for styling

function UpdateBookingPage() {
  const { bookingId } = useParams(); // Extract the booking ID from the URL params
  const [booking, setBooking] = useState(null); // State to hold booking details
  const [date, setDate] = useState(new Date()); // Currently selected date
  const [availableSlots, setAvailableSlots] = useState([]); // Slots fetched from the backend
  const [selectedSlot, setSelectedSlot] = useState(null); // The user's selected slot
  const [message, setMessage] = useState(''); // User feedback messages

  useEffect(() => {
    // Fetch booking details
    axios
      .get(`http://localhost:3000/customer/bookings/${bookingId}`, { withCredentials: true })
      .then((response) => {
        setBooking(response.data); // Save booking details
        setDate(new Date(response.data.Date_start)); // Initialize date selector
      })
      .catch((error) => {
        console.error('Error fetching booking details:', error);
        setMessage('Failed to load booking details.');
      });
  }, [bookingId]);

  useEffect(() => {
    if (booking) {
      // Fetch availability for the selected date and pro associated with the booking
      axios
        .get(`http://localhost:3000/availability/${booking.pro_id}`, {
          params: { date: date.toISOString() }, // Pass the selected date as a query parameter
          withCredentials: true,
        })
        .then((response) => {
          setAvailableSlots(response.data.availability); // Update available slots with the response data
        })
        .catch((error) => {
          console.error('Error fetching availability:', error);
          setMessage('Failed to fetch available slots.');
        });
    }
  }, [booking, date]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSlot) {
      setMessage('Please select a time slot.');
      return;
    }

    try {
      // Submit the updated booking to the backend
      await axios.put(
        `http://localhost:3000/customer/bookings/${bookingId}`,
        {
          Date_start: selectedSlot.Date_start,
          Date_end: selectedSlot.Date_end,
        },
        { withCredentials: true }
      );

      setMessage('Booking updated successfully!');
    } catch (error) {
      console.error('Error updating booking:', error);
      setMessage('Failed to update booking.');
    }
  };

  return (
    <div className="update-booking-container">
      <div className="booking-header">
        {booking && (
          <h2>
            Update Booking with {booking.Pro ? `${booking.Pro.first_name} ${booking.Pro.last_name}` : 'N/A'}
          </h2>
        )}
        {booking && (
          <p className="booking-details">
            Current booking: {new Date(booking.Date_start).toLocaleString('fr-FR')} to {new Date(booking.Date_end).toLocaleString('fr-FR')}
          </p>
        )}
      </div>

      <form className="update-booking-form" onSubmit={handleSubmit}>
        {booking ? (
          <>
            <div className="form-section">
              <DateSelector selectedDate={date} onDateChange={setDate} />
            </div>

            <div className="form-section">
              <AvailableSlots slots={availableSlots} onSelectSlot={setSelectedSlot} />
            </div>

            <button className="submit-button" type="submit">
              Update Booking
            </button>
          </>
        ) : (
          <p className="loading-message">Loading booking details...</p>
        )}
      </form>

      {message && <p className="feedback-message">{message}</p>}
    </div>
  );
}

export default UpdateBookingPage;
