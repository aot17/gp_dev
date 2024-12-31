import React from 'react';
import './ManageBookings.css'; // For modal styles

const BookingModal = ({ visible, onClose, children }) => {
  // Don't render anything if modal is not visible
  if (!visible) return null;

  return (
    <>
      {/* Overlay to close modal when clicked outside */}
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal">
        <div className="modal-content">
          {children} {/* Render form or other content passed as children */}
        </div>
      </div>
    </>
  );
};

export default BookingModal;
