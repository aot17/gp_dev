import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/Navigation/NavigationBar';
import Footer from './components/Navigation/Footer';
import LandingPage from './pages/LandingPage';
import CustomerLogin from './components/Auth/CustomerLogin';
import CustomerSignup from './components/Auth/CustomerSignup';
import ProLogin from './components/Auth/ProLogin';
import CustomerProfile from './pages/CustomerProfile';
import ProBackOffice from './pages/ProBackOffice';
import BookingPage from './pages/BookingPage';
import UpdateBookingPage from './pages/UpdateBookingPage';


function App() {
  return (
    <Router>
      <NavigationBar />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/customer-signup" element={<CustomerSignup />} />
          <Route path="/pro-login" element={<ProLogin />} />
          <Route path="/customer-profile" element={<CustomerProfile />} />
          <Route path="/update-booking/:bookingId" element={<UpdateBookingPage />} />
          <Route path="/booking/:proId" element={<BookingPage />} />
          <Route path="/pro-back-office" element={<ProBackOffice />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
