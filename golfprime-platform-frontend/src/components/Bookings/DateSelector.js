import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function DateSelector({ selectedDate, onDateChange }) {
  return (
    <div>
      <label>Select Date and Time:</label>
      <DatePicker
        selected={selectedDate}
        onChange={onDateChange}
        showTimeSelect
        dateFormat="Pp"
      />
    </div>
  );
}

export default DateSelector;
