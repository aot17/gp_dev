import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CustomerSignup() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    gender: 'male', // default value
    email: '',
    phone: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3000/customer/signup', formData);
      setMessage('Signup successful! Please log in.');
      navigate('/customer-login'); // Redirect to login after signup
    } catch (error) {
      setMessage('Signup failed: ' + error.response?.data?.message || 'Unknown error');
    }
  };

  return (
    <div>
      <h2>Customer Signup</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
        <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <button type="submit">Sign Up</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default CustomerSignup;
