import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CalendarSettings.css'
import CreateUnavailabilityForm from './CreateUnavailabilityForm'; // Form for unavailabilities
import EditUnavailabilityForm from './EditUnavailabilityForm'; // Form for unavailabilities

function ManageUnavailabilities({ 
  selectedDate, 
  setEvents, 
  setModalVisible, 
  existingUnavailability, 
  unavailId, 
  fetchEvents,
  mode 
}) {
  // State
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

    // Create unavailability
    const handleCreateUnavailability = (unavailability) => {
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
          fetchEvents(); // Refetch bookings to update the calendar
        })
        .catch((error) => {
          console.error('Error adding unavailability:', error);
                // Extract the error message from the response or use a default
          const errorMsg =
            error.response?.data?.message || 'Failed to add unavailability.';
          setErrorMessage(errorMsg); // Set error message for the modal
        });
    };

  // **Update Unavailability**
  const handleUpdateUnavailability = (unavailability) => {

    axios
      .put(`http://localhost:3000/unavailabilities/${unavailId}`, unavailability, { withCredentials: true })
      .then((response) => {
        // Update the existing unavailability in the events list
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === unavailId
              ? {
                  ...event,
                  start: new Date(response.data.Date_start),
                  end: new Date(response.data.Date_end),
                  title: `Unavailable: ${response.data.reason}`, // Fixed
                  className: 'unavailability-event', // Ensure correct className
                }
              : event
          )
        );
        setModalVisible(false); // Close modal
        setSuccessMessage('Unavailability updated successfully!');
      })
      .catch((error) => {
        console.error('Error updating unavailability:', error);
        setErrorMessage('Failed to update unavailability.');
      });
  };

  // **Delete Unavailability**
  const handleDeleteUnavailability = async () => {
    if (!unavailId) return; // No booking selected to delete

    try {
      await axios.delete(`http://localhost:3000/unavailabilities/${unavailId}`, {
        withCredentials: true,
      });

      // Remove deleted booking from events
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== unavailId));

      setModalVisible(false); // Close modal
      setSuccessMessage('Unavailability deleted successfully!');
    } catch (error) {
      console.error('Error deleting unavailability:', error);
      setErrorMessage('Failed to delete unavailability.');
    }
  };

  return (
    <div>
      {mode === 'create' ? (
        <CreateUnavailabilityForm
          selectedDate={selectedDate}
          handleCreateUnavailability={handleCreateUnavailability}
          setEvents={setEvents}
          setModalVisible={setModalVisible}
        />
      ) : (
        <EditUnavailabilityForm
          existingUnavailability={existingUnavailability}
          handleUpdateUnavailability={handleUpdateUnavailability}
          handleDeleteUnavailability={handleDeleteUnavailability}
          setEvents={setEvents}
          setModalVisible={setModalVisible}
        />
      )}
    </div>
  );
  }

export default ManageUnavailabilities;
