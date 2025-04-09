import { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await axios.post('http://localhost:5000/login', formData);
      
      // Store email for reset password flow
      localStorage.setItem('email', formData.email);
      
      // Check if this is the first login
      if (res.data.firstLogin) {
        toast.info('First login detected. Please reset your password.');
        navigate('/reset-password', { 
          state: { 
            email: formData.email, 
            initialPassword: formData.password 
          }
        });
        return;
      }
      
      // Regular login flow
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        toast.success('Login successful!');
        navigate('/homepage');
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };
    
  return (
    <div className="fullscreen-login">
      <div className="login-container">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Login to  NEC Visitor Management System</p>
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
            />
          </div>

          <div className="input-group">
            <Lock className="icon" />
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Password" 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
            {!loading && <ArrowRight className="button-icon" />}
          </button>
        </form>

        <div className="auth-footer">
          <p>Initial Password : 123456</p>
        </div>
      </div>
    </div>
  );
};

export default Login;