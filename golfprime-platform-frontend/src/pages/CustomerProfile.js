import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CustomerBookings from '../components/Profile/CustomerBookings';
import CustomerPersonalInfo from '../components/Profile/CustomerPersonalInfo';
import { useNavigate } from 'react-router-dom';
import './CustomerProfile.css';

function CustomerProfile() {
  // State to track which section (reservations or personal info) is active
  const [activeSection, setActiveSection] = useState('reservations');
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender:'',
  });

// Hook from React Router to navigate programmatically
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch customer profile information
    axios
      .get('http://localhost:3000/customer/profile', { withCredentials: true })
      .then((response) => {
        console.log('Fetched profile data:', response.data); // Log response
        setCustomerInfo({
          firstName: response.data.first_name,
          lastName: response.data.last_name,
          email: response.data.email,
          phone: response.data.phone,
          gender: response.data.gender,
        });
      })
      .catch((error) => {
        console.error('Error fetching customer info:', error);
        if (error.response?.status === 401) {
          navigate('/customer-login'); // Redirect to login if not authenticated
        }
      });
  }, [navigate]); // Dependency: Only re-run if `navigate` changes

  const handleProfileUpdate = () => {
    // Re-fetch data from the backend to ensure consistency
    axios
      .get('http://localhost:3000/customer/profile', { withCredentials: true })
      .then((response) => {
        setCustomerInfo({
          firstName: response.data.first_name,
          lastName: response.data.last_name,
          email: response.data.email,
          phone: response.data.phone,
          gender: response.data.gender,
        });
      })
      .catch((error) => {
        console.error('Error refetching customer info:', error);
      });
  };
  

  return (
    <div className="profile-container">
            {/* Sidebar for navigation */}
      <aside className="profile-sidebar">
        <div className="profile-header">
          <h2>
            {/* Display customer name if available, otherwise show 'Loading...' */}          
            {customerInfo.firstName && customerInfo.lastName 
                ? `${customerInfo.firstName} ${customerInfo.lastName}` 
                : 'Loading...'}
          </h2>
        </div>
        <ul>
          <li
            className={activeSection === 'reservations' ? 'active' : ''}
            onClick={() => setActiveSection('reservations')}
          >
            Mes réservations
          </li>
          <li
            className={activeSection === 'personal-info' ? 'active' : ''}
            onClick={() => setActiveSection('personal-info')}
          >
            Mes données personnelles
          </li>
        </ul>
      </aside>
      <main className="profile-content">
        {activeSection === 'reservations' && <CustomerBookings />}
        {activeSection === 'personal-info' && (
          <CustomerPersonalInfo 
            customerInfo={customerInfo}
            onProfileUpdate={handleProfileUpdate}
          />
        )}
      </main>
    </div>
  );
}

export default CustomerProfile;
