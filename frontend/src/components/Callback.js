import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!code) {
      console.error('No auth code found');
      navigate('/');
      return;
    }

    axios
      .post('http://localhost:5555/api/auth/callback', { code })
      .then(() => {
        navigate('/app');
      })
      .catch(() => {
        navigate('/');
      });
  }, [navigate]);

  return <p>Logging you in…</p>;
};

export default Callback;
