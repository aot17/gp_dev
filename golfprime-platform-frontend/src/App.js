// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import CustomerLogin from './components/CustomerLogin';
import ProLogin from './components/ProLogin';
import CustomerProfile from './components/CustomerProfile';
import BookingPage from './components/BookingPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/pro-login" element={<ProLogin />} />
          <Route path="/customer-profile" element={<CustomerProfile />} />
          <Route path="/booking/:proId" element={<BookingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
