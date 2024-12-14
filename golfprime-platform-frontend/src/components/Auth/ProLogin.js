import React, { useState } from 'react';
import axios from 'axios';
//import { useNavigate, Link } from 'react-router-dom';

function ProLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make the login request
      await axios.post(
        'http://localhost:3000/auth/pro/login',
        { email, password },
        { withCredentials: true } // Enable cookies for Passport.js sessions
      );
      setMessage('Login successful!');
      // Reload the page to reflect the logged-in state
      //window.location.reload();
      //navigate('/http://localhost:3000'); // Redirect on success
      window.location.href = '/pro-back-office'; // Redirects to the landing page dynamically

    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Login failed due to server error.';
      setMessage(errorMessage);
    }
  };

  return (
    <div className="login-container">
      <h2>Pro Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default ProLogin;
