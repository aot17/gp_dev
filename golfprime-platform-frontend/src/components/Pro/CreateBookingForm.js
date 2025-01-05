import React, { useState } from 'react';
import './CalendarSettings.css'

const CreateBookingForm = ({
  selectedDate,
  preSelectedSlot,
  availableSlots,
  customers,
  handleCreateBooking,
  setModalVisible,
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(preSelectedSlot || '');
  const [errorMessage, setErrorMessage] = useState('');

  // Format the selected date
  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  // Handle Create
  const handleSave = () => {
    if (!selectedCustomer || !selectedSlot) {
      setErrorMessage('Please select a customer and time slot.');
      return;
    }

    // Create Booking
    handleCreateBooking({
      customer_id: parseInt(selectedCustomer),
      Date_start: selectedSlot.Date_start,
      Date_end: selectedSlot.Date_end,
    });
  };

  return (
    <div className="modal-content">
      <h3>Create Booking</h3>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {/* Display selected date */}
      <p>
        <strong>Selected Date:</strong> {formattedDate}
      </p>

      {/* Select Time Slot */}
      <label>Select Time Slot:</label>
      <select
        value={JSON.stringify(selectedSlot)}
        onChange={(e) => setSelectedSlot(JSON.parse(e.target.value))}
      >
        <option value="">-- Select Slot --</option>
        {availableSlots.map((slot, index) => (
          <option key={index} value={JSON.stringify(slot)}>
            {new Date(slot.Date_start).toLocaleTimeString()} -{' '}
            {new Date(slot.Date_end).toLocaleTimeString()}
          </option>
        ))}
      </select>

      {/* Select Customer */}
      <label>Select Customer:</label>
      <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}>
        <option value="">-- Select Customer --</option>
        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.name}
          </option>
        ))}
      </select>

      {/* Actions */}
      <div className="modal-actions">
        <button onClick={handleSave}>Save</button>
        <button onClick={() => setModalVisible(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default CreateBookingForm;
