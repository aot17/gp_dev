import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AvailableSlots.css'; // Add CSS for styling

function AvailableSlots({ proId, date, onSelectSlot, selectedSlot }) {
  const [slots, setSlots] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch availability for the selected date and pro
    if (!proId || !date) return;

    const fetchAvailability = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/availability/${proId}`, {
          params: { date: date.toISOString() },
          withCredentials: true,
        });
        setSlots(response.data.availability || []);
        setMessage('');
      } catch (error) {
        console.error('Error fetching availability:', error);
        setMessage('Failed to fetch available slots.');
        setSlots([]);
      }
    };

    fetchAvailability();
  }, [proId, date]);

  const handleSlotSelection = (slot) => {
    console.log('Slot selected:', slot);  // Log the selected slot
    onSelectSlot(slot);  // Trigger parent callback
  };

  return (
    <div className="available-slots-container">
      <h3>Available Time Slots</h3>
      {message && <p className="error-message">{message}</p>}
      {slots.length > 0 ? (
        <ul>
          {slots.map((slot, index) => (
            <li key={index}>
              <button
                className={`slot-button ${selectedSlot === slot ? 'selected' : ''}`}
                type="button" // Prevent form submission
                onClick={() => handleSlotSelection(slot)} // Log when a slot is selected
              >
                {new Date(slot.Date_start).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} -{' '}
                {new Date(slot.Date_end).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No available slots for the selected date.</p>
      )}
    </div>
  );
}

export default AvailableSlots;
