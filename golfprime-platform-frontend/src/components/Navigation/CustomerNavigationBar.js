import React from 'react';
import { Link } from 'react-router-dom';
import CustomerLogout from '../Auth/CustomerLogout'; // Ensure the path is correct
import './CustomerNavigationBar.css'; // Optional for styling

function CustomerNavigationBar() {
  const isCustomerLoggedIn = document.cookie.includes('connect.sid'); // Check if session exists

  return (
    <nav className="navigation-bar">
      <div className="nav-left">
        <Link to="/" className="nav-brand">GolfPrime</Link>
      </div>
      <div className="nav-right">
      {isCustomerLoggedIn ? (
          <button onClick={CustomerLogout} className="nav-link logout-button">Logout</button>
        ) : (
          <>
            <Link to="/pro-login" className="nav-link">I'm a Pro</Link>
            <Link to="/customer-login" className="nav-link">Customer Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default CustomerNavigationBar;
