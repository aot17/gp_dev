// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CustomerLogin from './components/CustomerLogin';
import ProLogin from './components/ProLogin';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Golf Prime Platform</h1>
          <nav>
            <Link to="/customer-login" style={{ margin: '0 10px' }}>Customer Login</Link>
            <Link to="/pro-login" style={{ margin: '0 10px' }}>Pro Login</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/customer-login" element={<CustomerLogin />} />
            <Route path="/pro-login" element={<ProLogin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
