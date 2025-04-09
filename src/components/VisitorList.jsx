import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, User, Phone, MapPin, FileText, Edit, Trash2, LogOut } from 'lucide-react';
import '../styles/VisitorList.css';

const VisitorList = () => {
  const [visitors, setVisitors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'visitDate', direction: 'desc' });
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentVisitor, setCurrentVisitor] = useState(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [visitorToDelete, setVisitorToDelete] = useState(null);
  const [exitTime, setExitTime] = useState(null);

  // Fetch visitors data from backend
  const fetchVisitors = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/visitors');
      setVisitors(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching visitors:', err);
      setError('Failed to load visitor data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Convert "Apr 5, 2025" to "05-04-2025"
  const formatInputDate = (input) => {
    const date = new Date(input);
    if (isNaN(date)) return null;

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const getSortedAndFilteredVisitors = () => {
    const search = searchTerm.trim().toLowerCase();
  
    // If search term is empty, return all visitors (sorted)
    if (search === '') {
      return visitors.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
  
    const filtered = visitors.filter(visitor => {
      const searchLower = searchTerm.trim().toLowerCase();
    
      const matchesName = visitor.name.toLowerCase().startsWith(searchLower);
      const matchesPurpose = visitor.purpose.toLowerCase().startsWith(searchLower);
      const matchesPhone = visitor.phone.startsWith(searchTerm.trim());
      const matchesDate = visitor.visitDate.startsWith(searchTerm.trim());
    
      return matchesName || matchesPurpose || matchesPhone || matchesDate;
    });
    
    return filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // Handle edit button click
  const handleEditClick = (visitor) => {
    setCurrentVisitor(visitor);
    setShowEditForm(true);
  };

  // Handle delete button click
  const handleDeleteClick = (visitor) => {
    setVisitorToDelete(visitor);
    setShowDeleteWarning(true);
  };

  // Handle exit button click
  const handleExitClick = async (visitor) => {
    try {
      // Get current time
      const response = await axios.get('http://localhost:5000/current-time');
      const currentTime = response.data.currentTime;
      setExitTime(currentTime);
      
      // Update visitor record with exit time
      await axios.patch(`http://localhost:5000/visitors/${visitor._id}/exit`, {
        exitTime: currentTime
      });
      
      // Refresh visitor list
      fetchVisitors();
      
      // Show success message or notification
      alert(`Exit time recorded: ${currentTime}`);
    } catch (err) {
      console.error('Error recording exit time:', err);
      alert('Failed to record exit time. Please try again.');
    }
  };

  // Handle form submission for editing
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.put(`http://localhost:5000/visitors/${currentVisitor._id}`, currentVisitor);
      setShowEditForm(false);
      fetchVisitors();
    } catch (err) {
      console.error('Error updating visitor:', err);
      alert('Failed to update visitor information. Please try again.');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentVisitor({
      ...currentVisitor,
      [name]: value
    });
  };

  // Handle confirmation of delete
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:5000/visitors/${visitorToDelete._id}`);
      setShowDeleteWarning(false);
      setVisitorToDelete(null);
      fetchVisitors();
    } catch (err) {
      console.error('Error deleting visitor:', err);
      alert('Failed to delete visitor record. Please try again.');
    }
  };

  const sortedAndFilteredVisitors = getSortedAndFilteredVisitors();

  return (
    <div className="visitor-list-container">
      <div className="visitor-list-header">
        <h2>Visitor Records</h2>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by name, purpose, phone or date (e.g., Apr 5, 2025)..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          <button onClick={fetchVisitors} className="refresh-button">
            Refresh
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-message">Loading visitor data...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : sortedAndFilteredVisitors.length === 0 ? (
        <div className="no-data-message">
          {searchTerm ? "No visitors match your search criteria." : "No visitor records found."}
        </div>
      ) : (
        <div className="visitors-table-container">
          <table className="visitors-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('name')}>
                  <User className="table-icon" />
                  Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('phone')}>
                  <Phone className="table-icon" />
                  Phone {sortConfig.key === 'phone' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('purpose')}>
                  <FileText className="table-icon" />
                  Purpose {sortConfig.key === 'purpose' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('visitDate')}>
                  <Calendar className="table-icon" />
                  Date {sortConfig.key === 'visitDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('visitTime')}>
                  <Clock className="table-icon" />
                  Time {sortConfig.key === 'visitTime' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('address')}>
                  <MapPin className="table-icon" />
                  Address {sortConfig.key === 'address' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredVisitors.map((visitor) => (
                <tr key={visitor._id}>
                  <td>{visitor.name}</td>
                  <td>{visitor.phone}</td>
                  <td>{visitor.purpose}</td>
                  <td>{formatDate(visitor.visitDate)}</td>
                  <td>{visitor.visitTime}</td>
                  <td>{visitor.address || '-'}</td>
                  <td className="action-buttons">
                    <button 
                      className="edit-button" 
                      onClick={() => handleEditClick(visitor)}
                      title="Edit visitor"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="delete-button" 
                      onClick={() => handleDeleteClick(visitor)}
                      title="Delete visitor"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button 
                      className="exit-button" 
                      onClick={() => handleExitClick(visitor)}
                      title="Record exit time"
                      disabled={visitor.exitTime}
                    >
                      <LogOut size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Form Modal */}
      {showEditForm && currentVisitor && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Visitor Information</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={currentVisitor.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone:</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={currentVisitor.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="purpose">Purpose:</label>
                <input
                  type="text"
                  id="purpose"
                  name="purpose"
                  value={currentVisitor.purpose}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address:</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={currentVisitor.address || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="save-button">Save</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowEditForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Warning Modal */}
      {showDeleteWarning && visitorToDelete && (
        <div className="modal-overlay">
          <div className="modal-content warning-modal">
            <h3>Delete Visitor Record</h3>
            <p>Are you sure you want to delete the record for {visitorToDelete.name}?</p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="modal-buttons">
              <button 
                className="delete-confirm-button"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
              <button 
                className="cancel-button"
                onClick={() => {
                  setShowDeleteWarning(false);
                  setVisitorToDelete(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorList;