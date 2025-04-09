import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, MapPin, FileText } from 'lucide-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/VisitorForm.css';

const VisitorForm = ({ onVisitorAdded }) => {
  const getCurrentDate = () => new Date().toISOString().split('T')[0];

  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return { time: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`, period };
  };

  const initialFormState = {
    name: '',
    phone: '',
    purpose: '',
    visitDate: getCurrentDate(),
    visitTime: getCurrentTime().time,
    visitPeriod: getCurrentTime().period,
    address: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const resetForm = () => {
    // Reset to fresh values including current date and time
    setFormData({
      ...initialFormState,
      visitDate: getCurrentDate(),
      visitTime: getCurrentTime().time,
      visitPeriod: getCurrentTime().period,
    });
  };

  const getFormattedTime = () => {
    let [hours, minutes] = formData.visitTime.split(':');
    hours = formData.visitPeriod === 'PM' ? (+hours % 12) + 12 : +hours % 12;
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formattedData = { 
      ...formData, 
      visitTime: getFormattedTime() 
    };

    try {
      const response = await axios.post('http://localhost:5000/api/add-visitor', formattedData, {
        headers: { 'Content-Type': 'application/json' }
      });

      // Show success message
      toast.success('Visitor registered successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      
      // Reset form to initial state
      resetForm();
      
      // Call the callback to refresh visitor list
      if (onVisitorAdded && typeof onVisitorAdded === 'function') {
        onVisitorAdded();
      }
      
    } catch (error) {
      console.error('Error submitting visitor data:', error);
      
      // Show error message with details when available
      const errorMessage = error.response?.data?.message || 'Failed to register visitor. Please try again.';
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Add ToastContainer component at the top level */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div className="visitor-form-container">
        <div className="visitor-form-header">
          <h2>Visitor Registration</h2>
        </div>

        <div className="visitor-form-body">
          <form onSubmit={handleSubmit} className="visitor-form">
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="input-group">
                <User className="icon" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                />
              </div>
              <div className="input-group">
                <Phone className="icon" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  required
                />
              </div>
              <div className="input-group">
                <MapPin className="icon" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                  rows="1"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Visit Details</h3>
              <div className="input-group">
                <FileText className="icon" />
                <input
                  type="text"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  placeholder="Purpose of Visit"
                  required
                />
              </div>
              <div className="grid-container">
                <div className="input-group">
                  <Calendar className="icon" />
                  <input
                    type="date"
                    name="visitDate"
                    value={formData.visitDate}
                    onChange={handleChange}
                    required
                    readOnly
                  />
                </div>
                <div className="input-group time-group">
                  <Clock className="icon" />
                  <input
                    type="time"
                    name="visitTime"
                    value={formData.visitTime}
                    onChange={handleChange}
                    required
                    readOnly
                  />
                  <input
                    type="text"
                    name="visitPeriod"
                    value={formData.visitPeriod}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-button" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default VisitorForm;
