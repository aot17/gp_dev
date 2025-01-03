import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/Navigation/NavigationBar';
import Footer from './components/Navigation/Footer';
import LandingPage from './pages/LandingPage';
import CustomerLogin from './components/Auth/CustomerLogin';
import CustomerSignup from './components/Auth/CustomerSignup';
import ProLogin from './components/Auth/ProLogin';
import CustomerProfilePage from './pages/CustomerProfilePage';
import ProBackOfficePage from './pages/ProBackOfficePage';
import CreateBookingPage from './pages/CreateBookingPage';
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
          <Route path="/customer-profile" element={<CustomerProfilePage />} />
          <Route path="/update-booking/:bookingId" element={<UpdateBookingPage />} />
          <Route path="/booking/:proId" element={<CreateBookingPage />} />
          <Route path="/pro-back-office" element={<ProBackOfficePage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
