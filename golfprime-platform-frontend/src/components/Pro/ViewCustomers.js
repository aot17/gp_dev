import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewCustomers.css';

function ViewCustomers() {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:3000/pro/customers', { withCredentials: true })
      .then((response) => {
        setCustomers(response.data);
        setError('');
      })
      .catch((error) => {
        console.error('Error fetching customers:', error);
        setError('Failed to fetch customers. Please try again later.');
      });
  }, []);

  return (
    <div className="view-customers-container">
      <h2 className="customer-title">Clients List</h2>
      {error && <p className="error-message">{error}</p>}
      {customers.length > 0 ? (
        <ul className="customer-list">
          {customers.map((customer) => (
            <li key={customer.id} className="customer-item">
              <span className="customer-field">
                <strong>Name:</strong> {customer.name}
              </span>
              <span className="customer-field">
                <strong>Email:</strong> {customer.email}
              </span>
              <span className="customer-field">
                <strong>Phone:</strong> {customer.phone}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        !error && <p className="no-customers">No customers found.</p>
      )}
    </div>
  );
}

export default ViewCustomers;
