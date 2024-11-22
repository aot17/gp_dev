import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import DateSelector from '../components/Bookings/DateSelector';
import AvailableSlots from '../components/Bookings/AvailableSlots';
import processAvailability from '../components/Bookings/processAvailability'; // Import the function

function BookingPage() {
  const { proId } = useParams();
  const [date, setDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);

  console.log("Selected Slot:", selectedSlot); // Add this for debugging

  useEffect(() => {
    axios.get(`/availability/${proId}`)
      .then(response => {
        const { workingHours, unavailabilities } = response.data;

        // Process the data to generate available slots
        const slots = processAvailability(workingHours, unavailabilities, date);
        setAvailableSlots(slots);
        console.log('Available slots:', slots); // Debug: Check slots
      })
      .catch(error => {
        console.error('Error fetching availability:', error);
      });
  }, [proId, date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Selected Slot in handleSubmit:", selectedSlot); // Debug log    
    if (!selectedSlot) {
      setMessage('Please select a time slot.');
      return;
    }
    console.log('Selected Slot:', selectedSlot)

    const token = localStorage.getItem('customerToken');

    try {
      const response = await axios.post(
        'http://localhost:3000/booking',
        {
          pro_id: proId,
          Date_start: selectedSlot.Date_start,
          Date_end: selectedSlot.Date_end,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage('Booking successful!');
      console.log(response.data);
    } catch (error) {
      console.error('Booking error:', error.response); // Log the entire error response
      setMessage('Booking failed: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <div>
      <h2>Book a session with Pro {proId}</h2>
      <form onSubmit={handleSubmit}>
        <DateSelector selectedDate={date} onDateChange={setDate} />
        <AvailableSlots slots={availableSlots} onSelectSlot={setSelectedSlot} />
        <button type="submit">Book Now</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default BookingPage;