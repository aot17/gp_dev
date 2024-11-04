// src/components/CustomerLogin.js
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
      const response = await axios.post('http://localhost:3000/auth/customer/login', {
        email,
        password
      });

      const token = response.data.token;
      localStorage.setItem('customerToken', token); // Store token for later use
      setMessage('Login successful!');
      
      // Redirect to profile page after successful login
      navigate('/customer-profile');

    } catch (error) {
      setMessage('Login failed: ' + error.response?.data?.message || 'Unknown error');
    }
  };

  return (
    <div>
      <h2>Customer Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
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
