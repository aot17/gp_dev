import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomerNavigationBar from './components/Navigation/CustomerNavigationBar';
import Footer from './components/Navigation/Footer';
import LandingPage from './pages/LandingPage';
import CustomerLogin from './components/Auth/CustomerLogin';
import CustomerSignup from './components/Auth/CustomerSignup';
import ProLogin from './components/Auth/ProLogin';
import CustomerProfile from './pages/CustomerProfile';
import BookingPage from './pages/BookingPage';

function App() {
  return (
    <Router>
      <CustomerNavigationBar />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/customer-signup" element={<CustomerSignup />} />
          <Route path="/pro-login" element={<ProLogin />} />
          <Route path="/customer-profile" element={<CustomerProfile />} />
          <Route path="/booking/:proId" element={<BookingPage />} />
          {/* Add more routes as needed */}
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
