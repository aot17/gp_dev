import React, { useState } from 'react';

const BookingForm = ({
  selectedDate,
  preSelectedSlot,
  availableSlots,
  customers,
  handleSaveBooking,
  setModalVisible,
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(preSelectedSlot || '');
  const [errorMessage, setErrorMessage] = useState('');

  // Format selected date with day name (e.g., Monday 01/02/2025)
  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long', // Display full day name (Monday, Tuesday, etc.)
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const handleSave = () => {
    if (!selectedCustomer || !selectedSlot) {
      setErrorMessage('Please select a customer and time slot.');
      return;
    }

    // Save booking
    handleSaveBooking({
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

      {/* Time Slot selection */}
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

      {/* Customer selection */}
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

export default BookingForm;
