// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Calendar, Clock, User, Phone, MapPin, FileText, Search, ArrowUpDown } from 'lucide-react';
// import '../styles/VisitorHistory.css';

// const VisitorHistory = () => {
//   const [visitorHistory, setVisitorHistory] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortConfig, setSortConfig] = useState({ key: 'visitDate', direction: 'desc' });

//   // Fetch visitors with exit times from backend
//   const fetchVisitorHistory = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get('http://localhost:5000/visitors/history');
//       setVisitorHistory(response.data);
//       setError(null);
//     } catch (err) {
//       console.error('Error fetching visitor history:', err);
//       setError('Failed to load visitor history. Please try again later.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchVisitorHistory();
//   }, []);

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const requestSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'short', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   const formatTime = (timeString) => {
//     return timeString; // Return as is if already formatted
//   };

//   // Format the complete date and time
//   const formatDateTime = (dateTimeString) => {
//     if (!dateTimeString) return '-';
//     const date = new Date(dateTimeString);
//     if (isNaN(date.getTime())) return dateTimeString; // Return as is if not valid date
    
//     const options = { 
//       year: 'numeric', 
//       month: 'short', 
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
//     return date.toLocaleString(undefined, options);
//   };

//   // Calculate visit duration
//   const calculateDuration = (entryTime, exitTime) => {
//     if (!exitTime) return 'Not checked out';
    
//     const entry = new Date(entryTime);
//     const exit = new Date(exitTime);
    
//     if (isNaN(entry.getTime()) || isNaN(exit.getTime())) {
//       return 'Invalid time data';
//     }
    
//     const diff = exit - entry;
    
//     // Convert to hours and minutes
//     const hours = Math.floor(diff / (1000 * 60 * 60));
//     const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
//     return `${hours}h ${minutes}m`;
//   };

//   // Filter and sort visitors
//   const getSortedAndFilteredVisitors = () => {
//     const search = searchTerm.trim().toLowerCase();
  
//     // Filter visitors
//     const filtered = search === '' 
//       ? visitorHistory
//       : visitorHistory.filter(visitor => {
//           return (
//             visitor.name?.toLowerCase().includes(search) ||
//             visitor.purpose?.toLowerCase().includes(search) ||
//             visitor.phone?.includes(searchTerm.trim()) ||
//             (visitor.visitDate && visitor.visitDate.includes(searchTerm.trim())) ||
//             (visitor.hostName && visitor.hostName.toLowerCase().includes(search))
//           );
//         });
    
//     // Sort visitors
//     return filtered.sort((a, b) => {
//       if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
//       if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
//       return 0;
//     });
//   };

//   const sortedAndFilteredVisitors = getSortedAndFilteredVisitors();

//   return (
//     <div className="visitor-history-container">
//       <div className="visitor-history-header">
//         <h2>Visitor History</h2>
//         <div className="header-actions">
//           <div className="search-container">
//             <input
//               type="text"
//               placeholder="Search by name, purpose, phone or host..."
//               value={searchTerm}
//               onChange={handleSearchChange}
//               className="search-input"
//             />
//           </div>
//           <button onClick={fetchVisitorHistory} className="refresh-button">
//             Refresh
//           </button>
//         </div>
//       </div>

//       {isLoading ? (
//         <div className="loading-message">Loading visitor history...</div>
//       ) : error ? (
//         <div className="error-message">{error}</div>
//       ) : sortedAndFilteredVisitors.length === 0 ? (
//         <div className="no-data-message">
//           {searchTerm ? "No visitors match your search criteria." : "No visitor history records found."}
//         </div>
//       ) : (
//         <div className="visitors-table-container">
//           <table className="visitors-table">
//             <thead>
//               <tr>
//                 <th onClick={() => requestSort('name')}>
//                   <User className="table-icon" />
//                   Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//                 </th>
//                 <th onClick={() => requestSort('phone')}>
//                   <Phone className="table-icon" />
//                   Phone {sortConfig.key === 'phone' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//                 </th>
//                 <th onClick={() => requestSort('purpose')}>
//                   <FileText className="table-icon" />
//                   Purpose {sortConfig.key === 'purpose' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//                 </th>
//                 <th onClick={() => requestSort('visitDate')}>
//                   <Calendar className="table-icon" />
//                   Date {sortConfig.key === 'visitDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//                 </th>
//                 <th onClick={() => requestSort('visitTime')}>
//                   <Clock className="table-icon" />
//                   Entry Time {sortConfig.key === 'visitTime' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//                 </th>
//                 <th onClick={() => requestSort('exitTime')}>
//                   <Clock className="table-icon" />
//                   Exit Time {sortConfig.key === 'exitTime' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//                 </th>
//                 <th>Duration</th>
//                 <th onClick={() => requestSort('hostName')}>
//                   <User className="table-icon" />
//                   Host {sortConfig.key === 'hostName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//                 </th>
//                 <th onClick={() => requestSort('address')}>
//                   <MapPin className="table-icon" />
//                   Address {sortConfig.key === 'address' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {sortedAndFilteredVisitors.map((visitor) => (
//                 <tr key={visitor._id}>
//                   <td>{visitor.name}</td>
//                   <td>{visitor.phone}</td>
//                   <td>{visitor.purpose}</td>
//                   <td>{formatDate(visitor.visitDate)}</td>
//                   <td>{formatTime(visitor.visitTime)}</td>
//                   <td>{visitor.exitTime ? formatTime(visitor.exitTime) : 'Not recorded'}</td>
//                   <td>{calculateDuration(
//                     // If we have both date and time, combine them for accurate duration calculation
//                     visitor.visitDate && visitor.visitTime 
//                       ? `${visitor.visitDate}T${visitor.visitTime}` 
//                       : visitor.entryTime, 
//                     visitor.exitTime
//                   )}</td>
//                   <td>{visitor.hostName || '-'}</td>
//                   <td>{visitor.address || '-'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VisitorHistory;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, User, Phone, MapPin, FileText } from 'lucide-react';
import '../styles/VisitorHistory.css';

const VisitorHistory = () => {
  const [visitorHistory, setVisitorHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'visitDate', direction: 'desc' });

  // Fetch visitors with exit times from backend
  const fetchVisitorHistory = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/visitors/history');
      setVisitorHistory(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching visitor history:', err);
      setError('Failed to load visitor history. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitorHistory();
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
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    return timeString || '-'; // Return as is if already formatted or '-' if undefined
  };

  // Filter and sort visitors
  const getSortedAndFilteredVisitors = () => {
    const search = searchTerm.trim().toLowerCase();
  
    // Filter visitors
    const filtered = search === '' 
      ? visitorHistory
      : visitorHistory.filter(visitor => {
          return (
            visitor.name?.toLowerCase().includes(search) ||
            visitor.purpose?.toLowerCase().includes(search) ||
            visitor.phone?.includes(searchTerm.trim()) ||
            (visitor.visitDate && visitor.visitDate.includes(searchTerm.trim()))
          );
        });
    
    // Sort visitors
    return filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const sortedAndFilteredVisitors = getSortedAndFilteredVisitors();

  return (
    <div className="visitor-history-container">
      <div className="visitor-history-header">
        <h2>Visitor History</h2>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by name, purpose, or phone..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          <button onClick={fetchVisitorHistory} className="refresh-button">
            Refresh
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-message">Loading visitor history...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : sortedAndFilteredVisitors.length === 0 ? (
        <div className="no-data-message">
          {searchTerm ? "No visitors match your search criteria." : "No visitor history records found."}
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
                  Entry Date {sortConfig.key === 'visitDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('visitTime')}>
                  <Clock className="table-icon" />
                  Entry Time {sortConfig.key === 'visitTime' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('exitDate')}>
                  <Calendar className="table-icon" />
                  Exit Date {sortConfig.key === 'exitDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('exitTime')}>
                  <Clock className="table-icon" />
                  Exit Time {sortConfig.key === 'exitTime' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => requestSort('address')}>
                  <MapPin className="table-icon" />
                  Address {sortConfig.key === 'address' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredVisitors.map((visitor) => (
                <tr key={visitor._id}>
                  <td>{visitor.name}</td>
                  <td>{visitor.phone}</td>
                  <td>{visitor.purpose}</td>
                  <td>{formatDate(visitor.visitDate)}</td>
                  <td>{formatTime(visitor.visitTime)}</td>
                  <td>{formatDate(visitor.exitDate) || '-'}</td>
                  <td>{visitor.exitTime ? formatTime(visitor.exitTime) : 'Not recorded'}</td>
                  <td>{visitor.address || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VisitorHistory;