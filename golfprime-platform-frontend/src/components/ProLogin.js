// src/components/ProLogin.js
import React, { useState } from 'react';
import axios from 'axios';

function ProLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/auth/pro/login', {
        email,
        password
      });

      const token = response.data.token;
      localStorage.setItem('proToken', token); // Store token for later use
      setMessage('Login successful!');
    } catch (error) {
      setMessage('Login failed: ' + error.response?.data?.message || 'Unknown error');
    }
  };

  return (
    <div>
      <h2>Pro Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default ProLogin;
