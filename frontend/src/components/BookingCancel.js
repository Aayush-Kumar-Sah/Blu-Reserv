import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BookingCancel = () => {
  const { id } = useParams();

  useEffect(() => {
    axios.patch(`http://localhost:5555/api/bookings/${id}/arrival-no`)
      .then(() => {
        alert("Booking cancelled. Slot released.");
      })
      .catch(() => {
        alert("Error cancelling booking");
      });
  }, [id]);

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h2>Cancelling your booking...</h2>
      <p>Please wait</p>
    </div>
  );
};

export default BookingCancel;
