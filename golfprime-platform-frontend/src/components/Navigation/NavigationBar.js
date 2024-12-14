import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NavigationBar.css'; // Update the stylesheet name if necessary

function NavigationBar() {
  const [userRole, setUserRole] = useState(null); // Tracks whether logged in as 'customer', 'pro', or null
  const navigate = useNavigate();

  // Check the current session to determine role
  useEffect(() => {
    axios
      .get('/auth/check-session', { withCredentials: true }) // Endpoint to check session
      .then((response) => {
        console.log('Check session response:', response.data); // Debugging response
        if (response.data.loggedIn) {
          setUserRole(response.data.user.role); // Set the role ('customer' or 'pro')
        } else {
          setUserRole(null); // Not logged in
        }
      })
      .catch((error) => {
        console.error('Error checking session:', error); // Debugging error case
        setUserRole(null);
      });
  }, []);

  console.log('User role:', userRole); // Debug to see the current role

  // Handle logout for both roles
  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true }); // Logout request
      setUserRole(null); // Reset role
      navigate('/'); // Redirect to homepage after logout
    } catch (error) {
      console.error('Error logging out:', error); // Debugging logout error
    }
  };

  return (
    <nav className="navigation-bar">
      <div className="nav-left">
        <Link to="/" className="nav-brand">GolfPrime</Link>
      </div>
      <div className="nav-right">
        {userRole === 'customer' && (
          <>
            <Link to="/customer-profile" className="nav-link">Mon profil</Link>
            <button onClick={handleLogout} className="nav-link logout-button">Logout</button>
          </>
        )}
        {userRole === 'pro' && (
          <>
            <Link to="/pro-back-office" className="nav-link">Back Office</Link>
            <button onClick={handleLogout} className="nav-link logout-button">Logout</button>
          </>
        )}
        {!userRole && (
          <>
            <Link to="/pro-login" className="nav-link">Pro Login</Link>
            <Link to="/customer-login" className="nav-link">Customer Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavigationBar;
