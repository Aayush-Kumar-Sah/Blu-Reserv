import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { managerAPI } from '../services/api';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManagerLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await managerAPI.login(formData);
            toast.success('Login successful');
            
            localStorage.removeItem('user');
            localStorage.removeItem('demoUser');
            // set manager
            localStorage.setItem('manager', JSON.stringify({ role: 'manager' }));
            navigate('/app');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="landing-container">
            <div className="landing-content" style={{ maxWidth: '400px', width: '90%' }}>
                <h2 className="landing-title" style={{ fontSize: '2rem' }}>Manager Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group-enhanced">
                        <label style={{ color: 'white' }}>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            style={{ background: 'rgba(255,255,255,0.9)' }}
                        />
                    </div>
                    <div className="form-group-enhanced">
                        <label style={{ color: 'white' }}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{ background: 'rgba(255,255,255,0.9)' }}
                        />
                    </div>
                    <button
                        type="submit"
                        className="start-button"
                        style={{ width: '100%', marginTop: '20px' }}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ width: '100%', marginTop: '10px', background: 'transparent', border: '1px solid white' }}
                        onClick={() => navigate('/')}
                    >
                        Back
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default ManagerLogin;
