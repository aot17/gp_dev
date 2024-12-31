import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import DateSelector from '../components/Bookings/DateSelector';
import AvailableSlots from '../components/Bookings/AvailableSlots';
import './UpdateBookingPage.css'; // Updated CSS

function UpdateBookingPage() {
  const { bookingId } = useParams(); // Extract the booking ID from the URL params
  const [booking, setBooking] = useState(null); // State to hold booking details
  const [date, setDate] = useState(new Date()); // Currently selected date
  const [selectedSlot, setSelectedSlot] = useState(null); // The user's selected slot
  const [message, setMessage] = useState(''); // User feedback messages
  const [proDetails, setProDetails] = useState(null); // State to store pro's details

  // Fetch booking details on mount
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/customer/bookings/${bookingId}`, {
          withCredentials: true,
        });
        setBooking(response.data);
        setDate(new Date(response.data.Date_start)); // Initialize date selector
        // Fetch pro details
        const proResponse = await axios.get(`http://localhost:3000/pro/${response.data.pro_id}`, {
          withCredentials: true,
        });
        setProDetails(proResponse.data);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setMessage('Failed to load booking details.');
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

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
    <div className="booking-page-container">
      <h2>
        Update Booking with{' '}
        {proDetails
          ? `${proDetails.first_name} ${proDetails.last_name}`
          : 'Loading...'}
      </h2>
      {booking && (
        <p className="booking-details">
          Current booking: {new Date(booking.Date_start).toLocaleString('fr-FR')} to{' '}
          {new Date(booking.Date_end).toLocaleString('fr-FR')}
        </p>
      )}
      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="calendar-and-slots">
          <div className="calendar-section">
            <DateSelector selectedDate={date} onDateChange={setDate} />
          </div>
          <div className="slots-section">
            <AvailableSlots
              proId={booking?.pro_id}
              date={date}
              selectedSlot={selectedSlot}
              onSelectSlot={setSelectedSlot}
            />
          </div>
        </div>
        <div className="action-section">
          <button type="submit" className="booking-button">
            Update Booking
          </button>
        </div>
      </form>

      {/* Feedback messages */}
      <p className="message">{message}</p>
    </div>
  );
}

export default UpdateBookingPage;
