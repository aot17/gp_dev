import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import DateSelector from '../components/Bookings/DateSelector';
import AvailableSlots from '../components/Bookings/AvailableSlots';

function BookingPage() {
  const { proId } = useParams(); // Extract the pro's ID from the URL params
  const [date, setDate] = useState(new Date()); // Currently selected date
  const [availableSlots, setAvailableSlots] = useState([]); // Slots fetched from the backend
  const [message, setMessage] = useState(''); // User feedback messages
  const [selectedSlot, setSelectedSlot] = useState(null); // The user's selected slot

  useEffect(() => {
    // Fetch availability for the selected date and pro
    axios
      .get(`http://localhost:3000/availability/${proId}`, {
        params: { date: date.toISOString() }, // Pass the selected date as a query parameter
        withCredentials: true, // Ensure cookies are sent for authentication
      })
      .then((response) => {
        setAvailableSlots(response.data.availability); // Update available slots with the response data
        console.log('Available slots:', response.data.availability); // Debug: log slots
      })
      .catch((error) => {
        console.error('Error fetching availability:', error);
        setMessage('Failed to fetch available slots.');
      });
  }, [proId, date]); // Re-fetch availability when `proId` or `date` changes

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure a slot is selected before proceeding
    if (!selectedSlot) {
      setMessage('Please select a time slot.');
      return;
    }

    try {
      // Submit the booking to the backend
      await axios.post(
        'http://localhost:3000/customer/bookings',
        {
          pro_id: proId,
          Date_start: selectedSlot.Date_start,
          Date_end: selectedSlot.Date_end,
        },
        { withCredentials: true } // Include cookies for session-based auth
      );

      setMessage('Booking successful!');
    } catch (error) {
      console.error('Error creating booking:', error);
      setMessage(
        'Booking failed: ' +
          (error.response?.data?.message || 'Unknown error. Please try again.')
      );
    }
  };

  return (
    <div>
      <h2>Book a session with Pro {proId}</h2>
      <form onSubmit={handleSubmit}>
        {/* Date Selector */}
        <DateSelector selectedDate={date} onDateChange={setDate} />

        {/* Available Slots Selector */}
        <AvailableSlots slots={availableSlots} onSelectSlot={setSelectedSlot} />

        {/* Booking Confirmation Button */}
        <button type="submit">Book Now</button>
      </form>

      {/* Display feedback messages */}
      <p>{message}</p>
    </div>
  );
}

export default BookingPage;
