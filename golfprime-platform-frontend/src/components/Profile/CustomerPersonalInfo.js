import React, { useState } from 'react';
import axios from 'axios';
import './CustomerPersonalInfo.css';

function CustomerPersonalInfo({ customerInfo, onProfileUpdate }) {
  console.log('Initial customerInfo:', customerInfo);
  const [editField, setEditField] = useState(null); // Track which field is being edited
  const [formData, setFormData] = useState(customerInfo); // Local state for form data
  console.log('Initial formData:', formData);
  const [message, setMessage] = useState('');

  // Handle input changes in the form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating field: ${name}, Value: ${value}`);
    setFormData((prev) => ({ ...prev, [name]: value })); // Update only the specific field
  };

  // Handle saving a single field update
  const handleSaveField = (field) => {
    const updatedField = { [field]: formData[field] };
    setEditField(null);
  
    axios
      .put('http://localhost:3000/customer/profile', updatedField, { withCredentials: true })
      .then(() => {
        setMessage('Votre profil a été mis à jour avec succès !');
        onProfileUpdate(); // Trigger parent to re-fetch
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
        setMessage('Failed to update profile.');
      });
  };
  
  const renderField = (label, fieldName, value) => {
    // Log the field name and value from formData
    console.log(`Rendering field: ${fieldName}, Value from formData: ${formData[fieldName]}`);
  
    return (
      <div className="profile-field">
        <span className="field-label">{label}:</span>
        {editField === fieldName ? (
          <>
            {fieldName === 'gender' ? (
              <select
                name={fieldName}
                value={formData[fieldName] || ''}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            ) : (
              <input
                type="text"
                name={fieldName}
                value={formData[fieldName] || ''}
                onChange={handleInputChange}
              />
            )}
            <button className="save-button" onClick={() => handleSaveField(fieldName)}>
              Save
            </button>
            <button className="cancel-button" onClick={() => setEditField(null)}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <span className="field-value">{value || 'N/A'}</span>
            <button
              className="edit-button"
              onClick={() => {
                console.log(`Editing field: ${fieldName}`);
                setEditField(fieldName);
              }}
            >
              Modifier
            </button>
          </>
        )}
      </div>
    );
  }; 

  return (
    <div className="personal-info-container">
      <h2>Mes données personnelles</h2>
      {renderField('Prénom', 'firstName', formData.firstName)}
      {renderField('Nom', 'lastName', formData.lastName)}
      {renderField('Email', 'email', formData.email)}
      {renderField('Numéro de téléphone', 'phone', formData.phone)}
      {renderField('Genre', 'gender', formData.gender)}

      {message && <p className="status-message">{message}</p>}
    </div>
  );
}

export default CustomerPersonalInfo;
