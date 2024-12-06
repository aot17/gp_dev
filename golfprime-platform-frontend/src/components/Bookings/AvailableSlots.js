import React from 'react';

function AvailableSlots({ slots, onSelectSlot }) {
  return (
    <div>
      <h3>Available Time Slots</h3>
      {slots.length > 0 ? (
        <ul>
          {slots.map((slot, index) => (
            <li key={index}>
              <button onClick={() => onSelectSlot(slot)}>
              {new Date(slot.Date_start).toLocaleTimeString()} -{' '}
              {new Date(slot.Date_end).toLocaleTimeString()}
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
