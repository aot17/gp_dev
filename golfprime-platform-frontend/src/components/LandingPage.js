// src/components/LandingPage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './LandingPage.css';

function LandingPage() {
  const [pros, setPros] = useState([]);

  useEffect(() => {
    // Fetch the list of pros from the backend
    axios.get('/pro')  // Adjust this path based on your backend routes
      .then(response => {
        setPros(response.data);
      })
      .catch(error => {
        console.error('Error fetching pros:', error);
      });
  }, []);

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="login-links">
          <Link to="/customer-login" className="login-link">Customer Login</Link>
          <Link to="/pro-login" className="login-link">Pro Login</Link>
        </div>
      </header>

      <main>
        <h1>Welcome to Golf Prime Platform</h1>
        <h2>Affiliated Pros</h2>
        <ul className="pros-list">
          {pros.map(pro => (
            <li key={pro.pro_id}>
              <Link to={`/booking/${pro.pro_id}`} className="pro-link">
                {pro.first_name} {pro.last_name}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default LandingPage;
