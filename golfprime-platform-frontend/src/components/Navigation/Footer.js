import React from 'react';
import './Footer.css'; // Optional CSS for styling

function Footer() {
  return (
    <footer className="app-footer">
      <p>&copy; {new Date().getFullYear()} Golf Prime Platform. All rights reserved.</p>
      <p>
        <a href="/terms">Terms of Service</a> | <a href="/privacy">Privacy Policy</a>
      </p>
    </footer>
  );
}

export default Footer;
