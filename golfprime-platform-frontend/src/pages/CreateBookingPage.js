import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DateSelector from '../components/Bookings/DateSelector';
import AvailableSlots from '../components/Bookings/AvailableSlots';
import axios from 'axios';
import './CreateBookingPage.css'; // Add custom styles

function CreateBookingPage() {
  const { proId } = useParams(); // Extract the pro's ID from the URL params
  const [date, setDate] = useState(new Date()); // Currently selected date
  const [selectedSlot, setSelectedSlot] = useState(null); // The user's selected slot
  const [message, setMessage] = useState(''); // User feedback messages
  const [proDetails, setProDetails] = useState(null); // State to store pro's details

  // Fetch pro details on component mount
  useEffect(() => {
    const fetchProDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/pro/${proId}`, {
          withCredentials: true,
        });
        setProDetails(response.data); // Store the pro's details
      } catch (error) {
        console.error('Error fetching pro details:', error);
      }
    };

    fetchProDetails();
  }, [proId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submit button clicked'); // Log when the submit button is clicked
    console.log('Selected slot when submitting:', selectedSlot);

    // Ensure a slot is selected before proceeding
    if (!selectedSlot) {
      setMessage('Please select a time slot.');
      return;
    }

    console.log('Booking submission started with slot:', selectedSlot); // Log the selected slot

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
    <div className="booking-page-container">
      <h2>
        Book a session with{' '}
        {proDetails
          ? `${proDetails.first_name} ${proDetails.last_name}`
          : `Pro ${proId}`}
      </h2>
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="calendar-and-slots">
          <div className="calendar-section">
            <DateSelector selectedDate={date} onDateChange={setDate} />
          </div>
          <div className="slots-section">
            <AvailableSlots
              proId={proId}
              date={date}
              selectedSlot={selectedSlot}
              onSelectSlot={setSelectedSlot}
            />
          </div>
        </div>
        {/* Independent Booking Button */}
        <div className="action-section">
          <button type="submit" className="booking-button">Book Now</button>
        </div>
      </form>

      {/* Display feedback messages */}
      <p className="message">{message}</p>
    </div>
  );
}

export default CreateBookingPage;
