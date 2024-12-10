import React, { useEffect, useState } from 'react';
import './CustomerProfile.css';
import axios from 'axios';
import CustomerBookings from '../components/Profile/CustomerBookings';
import CustomerPersonalInfo from '../components/Profile/CustomerPersonalInfo';
import { useNavigate } from 'react-router-dom';

function CustomerProfile() {
  const [activeSection, setActiveSection] = useState('reservations');
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch customer profile information
    axios
      .get('http://localhost:3000/customer/profile', { withCredentials: true })
      .then((response) => {
        setCustomerInfo({
          firstName: response.data.first_name,
          lastName: response.data.last_name,
          email: response.data.email,
        });
      })
      .catch((error) => {
        console.error('Error fetching customer info:', error);
        if (error.response?.status === 401) {
          navigate('/customer-login'); // Redirect to login if not authenticated
        }
      });
  }, [navigate]);

  return (
    <div className="profile-container">
      <aside className="profile-sidebar">
        <div className="profile-header">
          <h2>{customerInfo.firstName && customerInfo.lastName 
                ? `${customerInfo.firstName} ${customerInfo.lastName}` 
                : 'Loading...'}</h2>
        </div>
        <ul>
          <li
            className={activeSection === 'reservations' ? 'active' : ''}
            onClick={() => setActiveSection('reservations')}
          >
            Mes Réservations
          </li>
          <li
            className={activeSection === 'personal-info' ? 'active' : ''}
            onClick={() => setActiveSection('personal-info')}
          >
            Mes Données Personnelles
          </li>
        </ul>
      </aside>
      <main className="profile-content">
        {activeSection === 'reservations' && <CustomerBookings />}
        {activeSection === 'personal-info' && <CustomerPersonalInfo />}
      </main>
    </div>
  );
}

export default CustomerProfile;
