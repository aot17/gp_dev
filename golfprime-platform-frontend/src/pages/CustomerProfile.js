import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CustomerProfile() {
  const [bookings, setBookings] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch customer profile information
    axios
      .get('http://localhost:3000/customer/profile', { withCredentials: true })
      .then((response) => {
        setCustomerInfo(response.data);
      })
      .catch((error) => {
        console.error('Error fetching customer info:', error);
        if (error.response?.status === 401) {
          navigate('/customer-login'); // Redirect if not authenticated
        }
      });

    // Fetch customer bookings
    axios
      .get('http://localhost:3000/customer/bookings', { withCredentials: true })
      .then((response) => {
        setBookings(response.data);
      })
      .catch((error) => {
        console.error('Error fetching bookings:', error);
      });
  }, [navigate]);

  return (
    <div>
      <h1>Welcome, {customerInfo.first_name} {customerInfo.last_name}</h1>
      <h2>Your Bookings</h2>
      {bookings.length > 0 ? (
        <ul>
          {bookings.map((booking) => (
            <li key={booking.booking_id}>
              <div>
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
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
}

export default CustomerProfile;
