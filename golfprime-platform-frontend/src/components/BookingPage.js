// src/components/BookingPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function BookingPage() {
  const { proId } = useParams(); // Get the proId from the URL
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Automatically create a booking with default date and time
    const createBooking = async () => {
      // Set default start and end times (for example, today at 9:00-10:00 AM)
      const Date_start = new Date();
      Date_start.setHours(9, 0, 0); // 9:00 AM
      const Date_end = new Date();
      Date_end.setHours(10, 0, 0); // 10:00 AM

      try {
        const token = localStorage.getItem('customerToken');
        await axios.post(
          'http://localhost:3000/booking',
          {
            Date_start,
            Date_end,
            status: 'booked',
            customer_id: 2, // Replace with actual customer ID if available
            pro_id: proId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setMessage('Booking successful!');
      } catch (error) {
        setMessage('Booking failed: ' + (error.response?.data?.message || 'Unknown error'));
      }
    };

    createBooking();
  }, [proId]);

  return (
    <div>
      <h2>Booking Page</h2>
      <p>{message}</p>
    </div>
  );
}

export default BookingPage;
