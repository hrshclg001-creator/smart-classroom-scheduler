import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const TimetableApproval = () => {
  const { timetables, fetchTimetables, approveTimetable, deleteTimetable, loading } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTimetables();
  }, []);

  const handleApprove = async (id) => {
    if (window.confirm('Are you sure you want to approve this timetable?')) {
      const result = await approveTimetable(id);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this timetable and all its slots?')) {
      const result = await deleteTimetable(id);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading timetables...</div>;
  }

  return (
    <div className="container">
      <div className="card mt-4">
        <div className="card-header">
          <h2 className="card-title">Timetable Approval Workflow</h2>
        </div>
        <div className="card-body">
          {timetables.length === 0 ? (
            <p className="text-center">No timetables to display.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Batches</th>
                  <th>Semester</th>
                  <th>Status</th>
                  <th>Created By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {timetables.map(t => (
                  <tr key={t._id}>
                    <td>{t.name}</td>
                    <td>{t.batches.map(b => b.batch_name).join(', ')}</td>
                    <td>{t.semester}</td>
                    <td>
                      <span className={`badge ${t.status === 'approved' ? 'bg-success' : 'bg-secondary'}`}>
                        {t.status.toUpperCase()}
                      </span>
                    </td>
                    <td>{t.created_by.username}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => navigate(`/timetable/${t._id}`)}
                      >
                        View
                      </button>
                      {t.status === 'draft' && (
                        <button
                          className="btn btn-sm btn-success ml-2"
                          onClick={() => handleApprove(t._id)}
                        >
                          Approve
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-danger ml-2"
                        onClick={() => handleDelete(t._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimetableApproval;