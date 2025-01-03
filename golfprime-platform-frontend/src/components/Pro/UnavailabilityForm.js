import React, { useState, useEffect } from 'react';
import './ManageBookings.css'; // Import centralized styles

const UnavailabilityForm = ({ 
  selectedDate, 
  handleSaveUnavailability, 
  setModalVisible 
}) => {
  // State variables for dates, times, and reason
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reason, setReason] = useState('other'); // Default reason

  // Pre-fill date and time based on selected slot
  useEffect(() => {
    if (selectedDate) {
      const selectedDateString = selectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      const selectedTimeString = selectedDate.toTimeString().split(' ')[0].slice(0, 5); // Format HH:MM

      setStartDate(selectedDateString); // Pre-fill start date
      setStartTime(selectedTimeString); // Pre-fill start time

      // Default end time: +1 hour from start
      const endDateTime = new Date(selectedDate.getTime() + 60 * 60 * 1000); // Add 1 hour
      const endTimeString = endDateTime.toTimeString().split(' ')[0].slice(0, 5);

      setEndDate(selectedDateString); // Same day by default
      setEndTime(endTimeString); // Default to 1 hour later
    }
  }, [selectedDate]);

  // Handle Save
  const handleSave = () => {
    // Validation
    if (!startDate || !endDate || !startTime || !endTime) {
      alert('Please fill out all fields.');
      return;
    }

    // Combine date and time for start
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    if (start >= end) {
      alert('End date and time must be later than the start date and time.');
      return;
    }

    // Save the unavailability
    handleSaveUnavailability({
      Date_start: start.toISOString(),
      Date_end: end.toISOString(),
      reason,
    });
  };

  return (
    <div className="modal-content">
      <h3>Add Unavailability</h3>

      {/* Start Date */}
      <label>Start Date:</label>
      <input 
        type="date" 
        value={startDate} 
        onChange={(e) => setStartDate(e.target.value)} 
      />

      {/* Start Time */}
      <label>Start Time:</label>
      <input 
        type="time" 
        value={startTime} 
        onChange={(e) => setStartTime(e.target.value)} 
      />

      {/* End Date */}
      <label>End Date:</label>
      <input 
        type="date" 
        value={endDate} 
        onChange={(e) => setEndDate(e.target.value)} 
      />

      {/* End Time */}
      <label>End Time:</label>
      <input 
        type="time" 
        value={endTime} 
        onChange={(e) => setEndTime(e.target.value)} 
      />

      {/* Reason */}
      <label>Reason:</label>
      <select value={reason} onChange={(e) => setReason(e.target.value)}>
        <option value="holidays">Holidays</option>
        <option value="break">Break</option>
        <option value="personal">Personal</option>
        <option value="other">Other</option>
      </select>

      {/* Action Buttons */}
      <div className="modal-actions">
        <button onClick={handleSave}>Save</button>
        <button onClick={() => setModalVisible(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default UnavailabilityForm;
