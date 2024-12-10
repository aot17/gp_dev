import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CustomerPersonalInfo.css'; // Separate CSS for personal info

function CustomerPersonalInfo() {
  const [customerInfo, setCustomerInfo] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch customer profile information
    axios
      .get('http://localhost:3000/customer/profile', { withCredentials: true })
      .then((response) => {
        setCustomerInfo(response.data);
      })
      .catch((error) => {
        console.error('Error fetching customer info:', error);
        if (error.response?.status === 401) {
          navigate('/customer-login'); // Redirect if not authenticated
        }
      });
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    axios
      .put('http://localhost:3000/customer/profile', customerInfo, { withCredentials: true })
      .then((response) => {
        setMessage('Profile updated successfully!');
        setEditMode(false); // Exit edit mode
        setCustomerInfo(response.data); // Update profile info with the response
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
        setMessage('Failed to update profile.');
      });
  };

  return (
    <div className="personal-info-container">
      <h2>Mes Données Personnelles</h2>
      {editMode ? (
        <form className="personal-info-form" onSubmit={handleUpdateProfile}>
          <div>
            <label>First Name:</label>
            <input type="text" name="first_name" value={customerInfo.first_name} onChange={handleInputChange} />
          </div>
          <div>
            <label>Last Name:</label>
            <input type="text" name="last_name" value={customerInfo.last_name} onChange={handleInputChange} />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" name="email" value={customerInfo.email} onChange={handleInputChange} />
          </div>
          <div>
            <label>Phone:</label>
            <input type="text" name="phone" value={customerInfo.phone} onChange={handleInputChange} />
          </div>
          <div>
            <label>Gender:</label>
            <select name="gender" value={customerInfo.gender} onChange={handleInputChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
        </form>
      ) : (
        <div>
          <p>
            <strong>Name:</strong> {customerInfo.first_name} {customerInfo.last_name}
          </p>
          <p>
            <strong>Email:</strong> {customerInfo.email}
          </p>
          <p>
            <strong>Phone:</strong> {customerInfo.phone || 'N/A'}
          </p>
          <p>
            <strong>Gender:</strong> {customerInfo.gender || 'N/A'}
          </p>
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}


export default CustomerPersonalInfo;
