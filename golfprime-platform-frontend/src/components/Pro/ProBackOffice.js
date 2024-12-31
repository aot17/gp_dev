import React, { useState } from 'react';
import './ProBackOffice.css';
import ManageBookings from './ManageBookings';
import ViewCustomers from './ViewCustomers';

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
            className={activeSection === 'customers' ? 'active' : ''}
            onClick={() => setActiveSection('customers')}
          >
            View Customers
          </li>
        </ul>
      </aside>
      <main className="pro-main-content">
        {activeSection === 'bookings' && <ManageBookings />}
        {activeSection === 'customers' && <ViewCustomers />}
      </main>
    </div>
  );
}

export default ProBackOffice;
