import React, { useState, useEffect } from 'react';
import './CalendarSettings.css'
import { fetchAvailableSlots } from '../../services/CalendarServices';

const EditBookingForm = ({
  existingBooking,
  handleUpdateBooking,
  handleDeleteBooking,
  setModalVisible,
}) => {
  const [selectedDate, setSelectedDate] = useState(existingBooking.Date_start.split('T')[0]); // Date only (YYYY-MM-DD)
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState({
    Date_start: existingBooking.Date_start,
    Date_end: existingBooking.Date_end,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch available slots when the selected date changes
  useEffect(() => {
    const loadSlots = async () => {
      setLoading(true);
      try {
        await fetchAvailableSlots(new Date(selectedDate), setAvailableSlots, setErrorMessage);
      } catch (error) {
        console.error('Error fetching slots:', error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedDate) {
      loadSlots();
    }
  }, [selectedDate]); // Trigger when date changes

  // Save the updated booking
  const handleSave = () => {
    if (!selectedSlot || !selectedSlot.Date_start || !selectedSlot.Date_end) {
      setErrorMessage('Please select a valid time slot.');
      return;
    }

    handleUpdateBooking({
      Date_start: selectedSlot.Date_start,
      Date_end: selectedSlot.Date_end,
    });
  };

  return (
    <div className="modal-content">
      <h3>Edit Booking</h3>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {/* Date Selection */}
      <label>Date:</label>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      {/* Time Slot Selection */}
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

      {/* Actions */}
      <div className="modal-actions">
        <button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Update'}
        </button>
        <button onClick={() => setModalVisible(false)}>Cancel</button>
        <button onClick={handleDeleteBooking} style={{ backgroundColor: 'red' }}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default EditBookingForm;
