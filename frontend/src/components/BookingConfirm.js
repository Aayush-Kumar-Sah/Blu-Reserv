import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookingConfirm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.patch(`http://localhost:5555/api/bookings/${id}/arrival-yes`)
      .then(() => {
        alert("✅ Booking confirmed. See you soon!");
        navigate('/');   // redirect to home
      })
      .catch(() => {
        alert("Error confirming booking");
        navigate('/');   // redirect even on error
      });
  }, [id, navigate]);

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h2>Confirming your booking...</h2>
      <p>Please wait</p>
    </div>
  );
};

export default BookingConfirm;
