import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register'; // <-- Add this import
import Dashboard from './pages/Dashboard';
import FacultyManagement from './pages/FacultyManagement';
import BatchManagement from './pages/BatchManagement';
import SubjectManagement from './pages/SubjectManagement';
import ClassroomManagement from './pages/ClassroomManagement';
import TimetableGeneration from './pages/TimetableGeneration';
import TimetableViewer from './pages/TimetableViewer';
import TimetableApproval from './pages/TimetableApproval';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} /> {/* <-- New Registration Route */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Navbar />
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/faculty" element={
                <PrivateRoute>
                  <Navbar />
                  <FacultyManagement />
                </PrivateRoute>
              } />
              <Route path="/batches" element={
                <PrivateRoute>
                  <Navbar />
                  <BatchManagement />
                </PrivateRoute>
              } />
              <Route path="/subjects" element={
                <PrivateRoute>
                  <Navbar />
                  <SubjectManagement />
                </PrivateRoute>
              } />
              <Route path="/classrooms" element={
                <PrivateRoute>
                  <Navbar />
                  <ClassroomManagement />
                </PrivateRoute>
              } />
              <Route path="/generate-timetable" element={
                <PrivateRoute>
                  <Navbar />
                  <TimetableGeneration />
                </PrivateRoute>
              } />
              <Route path="/timetable/:id" element={
                <PrivateRoute>
                  <Navbar />
                  <TimetableViewer />
                </PrivateRoute>
              } />
              <Route path="/approve-timetables" element={
                <PrivateRoute>
                  <Navbar />
                  <TimetableApproval />
                </PrivateRoute>
              } />
            </Routes>
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;