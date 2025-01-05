import React, { useState } from 'react';
import './ProBackOffice.css';
import CalendarDashboard from './CalendarDashboard';
import ViewCustomers from './ViewCustomers';

function ProBackOffice() {
  const [activeSection, setActiveSection] = useState('calendar');

  return (
    <div className="pro-backoffice-container">
      <aside className="pro-sidebar">
        <ul>
          <li
            className={activeSection === 'calendar' ? 'active' : ''}
            onClick={() => setActiveSection('calendar')}
          >
            Calendar
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
        {activeSection === 'calendar' && <CalendarDashboard />}
        {activeSection === 'customers' && <ViewCustomers />}
      </main>
    </div>
  );
}

export default ProBackOffice;
