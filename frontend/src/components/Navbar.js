import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">Timetable Scheduler</div>
      <ul className="navbar-nav">
        <li>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
        </li>
        {user.role === 'admin' && (
          <>
            <li>
              <Link to="/faculty" className="nav-link">Faculty</Link>
            </li>
            <li>
              <Link to="/batches" className="nav-link">Batches</Link>
            </li>
            <li>
              <Link to="/subjects" className="nav-link">Subjects</Link>
            </li>
            <li>
              <Link to="/classrooms" className="nav-link">Classrooms</Link>
            </li>
            <li>
              <Link to="/generate-timetable" className="nav-link">Generate</Link>
            </li>
          </>
        )}
        {(user.role === 'admin' || user.role === 'dean') && (
          <li>
            <Link to="/approve-timetables" className="nav-link">Approve</Link>
          </li>
        )}
        <li>
          <span className="nav-link">Hi, {user.username}</span>
        </li>
        <li>
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;