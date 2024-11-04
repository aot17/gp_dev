import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavigationBar.css'; // Optional for styling

function NavigationBar() {
  const navigate = useNavigate();
  const customerToken = localStorage.getItem('customerToken');

  const handleLogout = () => {
    localStorage.removeItem('customerToken');
    navigate('/');
  };

  return (
    <nav className="navigation-bar">
      <div className="nav-left">
        <Link to="/" className="nav-brand">GolfPrime</Link>
      </div>
      <div className="nav-right">
        <Link to="/pro-login" className="nav-link">Pro Login</Link>
        {customerToken ? (
          <>
            <Link to="/customer-profile" className="nav-link">Mon Profile</Link>
            <button onClick={handleLogout} className="nav-link logout-button">Logout</button>
          </>
        ) : (
          <Link to="/customer-login" className="nav-link">Customer Login</Link>
        )}
      </div>
    </nav>
  );
}

export default NavigationBar;
