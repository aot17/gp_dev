import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CustomerBookings.css'; // Separate CSS for bookings

function CustomerBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3000/customer/bookings', { withCredentials: true })
      .then((response) => {
        setBookings(response.data);
      })
      .catch((error) => {
        console.error('Error fetching bookings:', error);
      });
  }, []);

  return (
    <div className="bookings-container">
      <h2>Mes Réservations</h2>
      {bookings.length > 0 ? (
        <ul className="bookings-list">
          {bookings.map((booking) => (
            <li key={booking.booking_id} className="booking-item">
              <p>
                <strong>Pro:</strong> {booking.Pro ? `${booking.Pro.first_name} ${booking.Pro.last_name}` : 'N/A'}
              </p>
              <p>
                <strong>Start:</strong> {new Date(booking.Date_start).toLocaleString()}
              </p>
              <p>
                <strong>End:</strong> {new Date(booking.Date_end).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong> {booking.status}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
}

export default CustomerBookings;