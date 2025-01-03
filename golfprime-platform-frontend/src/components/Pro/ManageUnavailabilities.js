import React, { useState } from 'react';
import axios from 'axios';
import UnavailabilityForm from './UnavailabilityForm'; // Form for unavailabilities

function ManageUnavailabilities({ selectedDate, preSelectedSlot, setEvents, setModalVisible }) {
  // State
  //const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

    // Save unavailability
    const handleSaveUnavailability = (unavailability) => {
      axios
        .post('http://localhost:3000/unavailabilities', unavailability, { withCredentials: true })
        .then((response) => {
          setEvents((prevEvents) => [
            ...prevEvents,
            {
              id: response.data.id,
              title: `Unavailable: ${response.data.reason}`,
              start: new Date(response.data.Date_start),
              end: new Date(response.data.Date_end),
              className: 'unavailability-event', // Styling
            },
          ]);
          setModalVisible(false);
          setSuccessMessage('Unavailability added successfully!');
          setErrorMessage(''); // Clear error on success
        })
        .catch((error) => {
          console.error('Error adding unavailability:', error);
                // Extract the error message from the response or use a default
          const errorMsg =
            error.response?.data?.message || 'Failed to add unavailability.';
          setErrorMessage(errorMsg); // Set error message for the modal
        });
    };

    return (
      <UnavailabilityForm
        selectedDate={selectedDate}
        handleSaveUnavailability={handleSaveUnavailability}
        setModalVisible={setModalVisible}
      />
    );
  }

export default ManageUnavailabilities;
