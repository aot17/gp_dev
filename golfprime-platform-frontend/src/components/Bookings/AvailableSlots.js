import React, { useState } from 'react';

function AvailableSlots({ slots, onSelectSlot }) {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div>
      <h3>Available Slots</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {slots.map((slot, index) => (
          <li
            key={index}
            onClick={() => {
              onSelectSlot(slot);
              setActiveIndex(index);
            }}
            style={{
              cursor: 'pointer',
              padding: '10px',
              margin: '5px 0',
              border: '1px solid #ddd',
              borderRadius: '5px',
              backgroundColor: activeIndex === index ? '#d0f0fd' : '#fff',
              transition: 'background-color 0.3s',
            }}
          >
            {new Date(slot.Date_start).toLocaleString()} - {new Date(slot.Date_end).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AvailableSlots;
