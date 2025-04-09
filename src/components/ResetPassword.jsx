import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, RefreshCw, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/Auth.css';

const ResetPassword = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Check if we're coming from login redirect
  useEffect(() => {
    if (location.state?.email && location.state?.initialPassword) {
      setFormData(prev => ({
        ...prev,
        email: location.state.email,
        currentPassword: location.state.initialPassword
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await axios.post('http://localhost:5000/reset-password', {
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        toast.success('Password reset successful!');
        navigate('/homepage');
      } else {
        throw new Error('Password reset failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password reset failed. Please try again.');
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fullscreen-login">
      <div className="login-container">
        <div className="auth-header">
          <h1>Reset Password</h1>
          <p>Please set a new password for your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <Mail className="icon" />
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Email Address" 
              required 
              readOnly={!!location.state?.email}
            />
          </div>

          <div className="input-group">
            <Lock className="icon" />
            <input 
              type="password" 
              name="currentPassword" 
              value={formData.currentPassword} 
              onChange={handleChange} 
              placeholder="Current Password" 
              required 
              readOnly={!!location.state?.initialPassword}
            />
          </div>

          <div className="input-group">
            <Lock className="icon" />
            <input 
              type="password" 
              name="newPassword" 
              value={formData.newPassword} 
              onChange={handleChange} 
              placeholder="New Password" 
              required 
            />
          </div>

          <div className="input-group">
            <RefreshCw className="icon" />
            <input 
              type="password" 
              name="confirmPassword" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              placeholder="Confirm New Password" 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
            {!loading && <ArrowRight className="button-icon" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;