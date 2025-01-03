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
      <main className="landing-main">
        <h1>Welcome to <span className="highlight">Golf Prime Platform</span></h1>
        <p className="description">Book sessions with professional golf trainers near you and improve your game today!</p>
        
        <h2 className="pros-title">Our Affiliated Pros</h2>
        <ul className="pros-list">
          {pros.map(pro => (
            <li key={pro.pro_id} className="pro-card">
              <Link to={`/booking/${pro.pro_id}`} className="pro-link">
                <div className="pro-info">
                  <h3>{pro.first_name} {pro.last_name}</h3>
                  <p>Book Now</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default LandingPage;
