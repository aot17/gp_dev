import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CustomerNavigationBar.css';

function CustomerNavigationBar() {
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check if the customer is logged in
  useEffect(() => {
    axios
      .get('/auth/check-session', { withCredentials: true }) // Endpoint to check session
      .then(response => {
        console.log('Check session response:', response.data); // Debugging response from backend
        setIsCustomerLoggedIn(response.data.loggedIn);
      })
      .catch(error => {
        console.error('Error checking session:', error); // Debugging error case
        setIsCustomerLoggedIn(false);
      });
  }, []);

  console.log('Customer login status:', isCustomerLoggedIn); // Logs state whenever the component re-renders

  // Handle customer logout
  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true }); // Logout request
      setIsCustomerLoggedIn(false); // Update state
      navigate('/customer-login'); // Redirect to login page
    } catch (error) {
      console.error('Error logging out:', error); // Debugging logout error
    }
  };

  console.log('Rendering navbar:', isCustomerLoggedIn ? 'Logged In' : 'Not Logged In'); // Logs rendering condition

  return (
    <nav className="navigation-bar">
      <div className="nav-left">
        <Link to="/" className="nav-brand">GolfPrime</Link>
      </div>
      <div className="nav-right">
        {isCustomerLoggedIn ? (
          <>
            <Link to="/customer-profile" className="nav-link">Mon profil</Link>
            <button onClick={handleLogout} className="nav-link logout-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/pro-login" className="nav-link">Pro Login</Link>
            <Link to="/customer-login" className="nav-link">Customer Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default CustomerNavigationBar;
