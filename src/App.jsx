import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';  // Import useNavigate
import { Home, Users, LogOut,Clock } from 'lucide-react';
import VisitorForm from './components/VisitorForm';
import './App.css';
import Login from './components/Login';
import VisitorList from './components/VisitorList';
import VisitorHistory from './components/visitorHistory';
import ResetPassword from './components/ResetPassword';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <header className="header">
            <h2 className="header-title">NEC VISITOR MANAGEMENT</h2>
            <div className="admin-info">
              <div className="admin-details">
                <p className="admin-name">  {JSON.parse(localStorage.getItem('user'))?.name || 'No user email found'}
                </p>
                <p className="admin-email">{JSON.parse(localStorage.getItem('user'))?.email || 'No user email found'}</p>
                </div>
              <div className="admin-avatar">  {JSON.parse(localStorage.getItem('user'))?.name[0] || 'No user email found'}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="content-box">
            <Routes>
            
              <Route path="/add-visitor" element={<VisitorForm />} />
              <Route
                path="/homepage"
                element={
                  <div className="welcome-text">
                    <h2>Welcome to Visitor Management System</h2>
                    <p>Select an option from the sidebar to get started</p>
                  </div>
                }
                />
                <Route path="/" element={<Login/>}/>
              <Route path="/visitors" element={<VisitorList />} />
              <Route path="/history" element={<VisitorHistory />} />
              <Route path="/reset-password" element={<ResetPassword />} />

            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();  // Use the useNavigate hook here

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); 
    localStorage.removeItem('email');
     // Clear auth token
    navigate('/');                 // Navigate to login page
  };

  return (
    <nav className="sidebar">
      <h1 className="sidebar-title">Visitor Management</h1>
      <ul className="sidebar-menu">
        <li>
          <Link to="/visitors" className="sidebar-link">
            <Home className="icon" />
            Dashboard
          </Link>
        </li>
        <li>
              <Link to="/history" className="sidebar-link">
              <Clock className="icon" />
                Visitor History
              </Link>
            </li>
        <li>
          <Link to="/add-visitor" className="sidebar-link">
            <Users className="icon" />
            Add Visitor
          </Link>
        </li>
      
        <li>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut className="icon" />
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default App;

