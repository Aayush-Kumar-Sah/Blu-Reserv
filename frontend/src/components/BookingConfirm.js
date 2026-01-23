
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BookingConfirm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // redirect to website
    navigate('/');
  }, [navigate]);

  return null;
};

export default BookingConfirm;
