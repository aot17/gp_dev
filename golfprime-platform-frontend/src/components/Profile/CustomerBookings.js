import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CustomerBookings.css'; // Separate CSS for bookings

function CustomerBookings() {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:3000/customer/bookings', { withCredentials: true })
      .then((response) => {
        //console.log('Bookings response:', response.data);
        if (response.data.upcoming && response.data.past) {
          setUpcomingBookings(response.data.upcoming);
          setPastBookings(response.data.past);
        } else {
          console.error('Unexpected response structure:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching bookings:', error);
      });
  }, []);

  const handleModifyBooking = (bookingId) => {
    navigate(`/update-booking/${bookingId}`); // Redirect to the update booking page
  };

  const handleDeleteBooking = (bookingId) => {
    if (window.confirm('Etes-vous sur de vouloir supprimer cette réservation?')) {
      axios
        .delete(`http://localhost:3000/customer/bookings/${bookingId}`, { withCredentials: true })
        .then(() => {
          alert('Réservation supprimée avec succès!');
          setUpcomingBookings((prev) =>
            prev.filter((booking) => booking.booking_id !== bookingId)
          ); // Remove canceled booking from the state
        })
        .catch((error) => {
          console.error('Error deleting booking:', error);
          alert('Failed to delete booking.');
        });
    }
  };
  

  const renderBooking = (booking) => (
    <li key={booking.booking_id} className="booking-item">
      <span className="booking-info">
        <strong>Start:</strong> {new Date(booking.Date_start).toLocaleString('fr-FR')}
      </span>
      <span className="booking-info">
        <strong>End:</strong> {new Date(booking.Date_end).toLocaleString('fr-FR')}
      </span>
      <span className="booking-info">
        <strong>Pro:</strong> {booking.Pro ? `${booking.Pro.first_name} ${booking.Pro.last_name}` : 'N/A'}
      </span>
      <span className="booking-status">
        <strong>Status:</strong> {booking.status}
      </span>
  
      {/* Show Modify and Cancel buttons only for upcoming bookings */}
      {new Date(booking.Date_start) > new Date() && (
        <div className="booking-actions">
          <button onClick={() => handleModifyBooking(booking.booking_id)}>Modifier</button>
          <button onClick={() => handleDeleteBooking(booking.booking_id)}>Supprimer</button>
        </div>
      )}
    </li>
  );
  

  return (
    <div className="page-container">
      <div className="content">
        <h2>Cours à venir</h2>
        <div className="booking-list">
          {upcomingBookings.length > 0 ? (
            <ul>{upcomingBookings.map(renderBooking)}</ul>
          ) : (
            <p>Pas de cours à venir.</p>
          )}
        </div>
  
        <h2>Historique des cours</h2>
        <div className="booking-list">
          {pastBookings.length > 0 ? (
            <ul>{pastBookings.map(renderBooking)}</ul>
          ) : (
            <p>Pas d'historique de cours.</p>
          )}
        </div>
      </div>
  
      <footer>
        <p>© 2024 GolfPrime</p>
      </footer>
    </div>
  );
  
}

export default CustomerBookings;
