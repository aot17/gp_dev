import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ViewClients() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    // Fetch clients data
    axios
      .get('http://localhost:3000/pro/clients', { withCredentials: true })
      .then((response) => setClients(response.data))
      .catch((error) => console.error('Error fetching clients:', error));
  }, []);

  return (
    <div>
      <h2>Clients</h2>
      {clients.length > 0 ? (
        <ul>
          {clients.map((client) => (
            <li key={client.id}>
              <p>
                <strong>Name:</strong> {client.name}
              </p>
              <p>
                <strong>Email:</strong> {client.email}
              </p>
              <p>
                <strong>Phone:</strong> {client.phone}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No clients found.</p>
      )}
    </div>
  );
}

export default ViewClients;
