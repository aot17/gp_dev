import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function CustomerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make the login request
      await axios.post(
        'http://localhost:3000/auth/customer/login',
        { email, password },
        { withCredentials: true } // Enable cookies for Passport.js sessions
      );

      setMessage('Login successful!');
      navigate('/customer-profile'); // Redirect on success
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Login failed due to server error.';
      setMessage(errorMessage);
    }
  };

  return (
    <div className="login-container">
      <h2>Customer Login</h2>
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
      <p>
        Pas encore de compte ? <Link to="/customer-signup">Inscrivez-vous !</Link>
      </p>
    </div>
  );
}

export default CustomerLogin;
