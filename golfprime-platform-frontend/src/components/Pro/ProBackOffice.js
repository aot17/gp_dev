import React, { useState } from 'react';
import './ProBackOffice.css';
import ManageBookings from './ManageBookings';
import ViewClients from './ViewClients';

function ProBackOffice() {
  const [activeSection, setActiveSection] = useState('bookings');

  return (
    <div className="pro-backoffice-container">
      <aside className="pro-sidebar">
        <h2>Pro Back Office</h2>
        <ul>
          <li
            className={activeSection === 'bookings' ? 'active' : ''}
            onClick={() => setActiveSection('bookings')}
          >
            Manage Bookings
          </li>
          <li
            className={activeSection === 'clients' ? 'active' : ''}
            onClick={() => setActiveSection('clients')}
          >
            View Clients
          </li>
        </ul>
      </aside>
      <main className="pro-main-content">
        {activeSection === 'bookings' && <ManageBookings />}
        {activeSection === 'clients' && <ViewClients />}
      </main>
    </div>
  );
}

export default ProBackOffice;
