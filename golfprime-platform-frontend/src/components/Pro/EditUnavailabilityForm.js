import React, { useState } from 'react';
import './CalendarSettings.css'

const EditUnavailabilityForm = ({
  existingUnavailability,
  handleUpdateUnavailability,
  handleDeleteUnavailability,
  setModalVisible,
}) => {
  const [startDate, setStartDate] = useState(
    new Date(existingUnavailability.start).toISOString().slice(0, 16)
  );
  const [endDate, setEndDate] = useState(
    new Date(existingUnavailability.end).toISOString().slice(0, 16)
  );
  const [reason, setReason] = useState(
    existingUnavailability.title.replace('Unavailable: ', '')
  );
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpdate = () => {
    if (!startDate || !endDate || !reason) {
      setErrorMessage('All fields are required.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      setErrorMessage('End date must be later than the start date.');
      return;
    }

    // Call the function passed from ManageUnavailabilities
    handleUpdateUnavailability({
      Date_start: start.toISOString(),
      Date_end: end.toISOString(),
      reason,
    });
  };

  return (
    <div className="modal-content">
      <h3>Edit Unavailability</h3>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <label>Start Date:</label>
      <input
        type="datetime-local"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <label>End Date:</label>
      <input
        type="datetime-local"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <label>Reason:</label>
      <select value={reason} onChange={(e) => setReason(e.target.value)}>
        <option value="holidays">Holidays</option>
        <option value="break">Break</option>
        <option value="personal">Personal</option>
        <option value="other">Other</option>
      </select>
      <div className="modal-actions">
        <button onClick={handleUpdate}>Update</button>
        <button onClick={() => setModalVisible(false)}>Cancel</button>
        <button
          onClick={handleDeleteUnavailability}
          style={{ backgroundColor: 'red' }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default EditUnavailabilityForm;
