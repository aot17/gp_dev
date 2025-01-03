import React from 'react';
import './ManageBookings.css'; // For modal styles

const BookingModal = ({ visible, onClose, children, errorMessage }) => {
  return (
    <>
      {visible && (
        <>
          <div className="modal-overlay" onClick={onClose}></div>
          <div className="modal">
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="modal-content">{children}</div>
          </div>
        </>
      )}
    </>
  );
};

export default BookingModal;
