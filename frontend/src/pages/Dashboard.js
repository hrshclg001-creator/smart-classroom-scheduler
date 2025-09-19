import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const {
    fetchFaculty,
    fetchBatches,
    fetchSubjects,
    fetchClassrooms,
    fetchTimetables,
    faculty,
    batches,
    subjects,
    classrooms,
    timetables,
    loading
  } = useData();

  useEffect(() => {
  fetchFaculty();
  fetchBatches();
  fetchSubjects();
  fetchClassrooms();
  fetchTimetables();
}, [fetchFaculty, fetchBatches, fetchSubjects, fetchClassrooms, fetchTimetables]);

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  const approvedTimetablesCount = timetables.filter(t => t.status === 'approved').length;

  return (
    <div className="container">
      <div className="card mt-4">
        <div className="card-header">
          <h2 className="card-title">Dashboard</h2>
        </div>
        <div className="card-body">
          <div className="dashboard-grid">
            <div className="stat-card">
              <div className="stat-number">{faculty.length}</div>
              <div className="stat-label">Faculty Members</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{batches.length}</div>
              <div className="stat-label">Student Batches</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{subjects.length}</div>
              <div className="stat-label">Subjects</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{classrooms.length}</div>
              <div className="stat-label">Classrooms</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{timetables.length}</div>
              <div className="stat-label">Timetables Generated</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{approvedTimetablesCount}</div>
              <div className="stat-label">Timetables Approved</div>
            </div>
          </div>
          <div className="text-center mt-4">
            {user.role === 'admin' && (
              <Link to="/generate-timetable" className="btn btn-primary btn-lg">
                Generate New Timetable
              </Link>
            )}
            {(user.role === 'admin' || user.role === 'dean') && (
              <Link to="/approve-timetables" className="btn btn-success btn-lg ml-3">
                Review Timetables
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;