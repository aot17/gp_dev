import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateSelector.css'; // Add custom styles here

function DateSelector({ selectedDate, onDateChange }) {
  return (
    <div className="date-selector-container">
      <label htmlFor="date-picker" className="date-label">
        Select a Date:
      </label>
      <DatePicker
        id="date-picker"
        selected={selectedDate}
        onChange={onDateChange}
        dateFormat="dd/MM/yyyy"
        className="custom-date-picker"
        timeFormat="HH:mm" // Enforces 24-hour format
        popperPlacement="bottom"
        inline
      />
    </div>
  );
}

export default DateSelector;
