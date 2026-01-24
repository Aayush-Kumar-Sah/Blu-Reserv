import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Callback = () => {
  const navigate = useNavigate();
  const hasCalledRef = useRef(false);

  useEffect(() => {
    // 🔒 Prevent double execution
    if (hasCalledRef.current) return;
    hasCalledRef.current = true;

    const code = new URLSearchParams(window.location.search).get('code');

    if (!code) {
      navigate('/');
      return;
    }

    axios
      .post('http://localhost:5555/api/auth/callback', { code })
      .then((res) => {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/app');
      })
      .catch((err) => {
        console.error(err);
        navigate('/');
      });
  }, [navigate]);

  return <p>Logging you in…</p>;
};

export default Callback;
