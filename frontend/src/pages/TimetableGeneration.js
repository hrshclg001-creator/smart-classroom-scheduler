import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const TimetableGeneration = () => {
  const { batches, fetchBatches, generateTimetable } = useData();
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [academicYear, setAcademicYear] = useState('');
  const [semester, setSemester] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleBatchChange = (e) => {
    const { options } = e.target;
    const selected = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setSelectedBatches(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedBatches.length === 0 || !academicYear || !semester) {
      setMessage({ type: 'error', text: 'Please fill all required fields.' });
      return;
    }
    setLoading(true);
    setMessage(null);
    const result = await generateTimetable({
      batches: selectedBatches,
      academicYear,
      semester: parseInt(semester, 10),
    });

    if (result.success) {
      setMessage({ type: 'success', text: 'Timetable generation started. Redirecting to viewer...' });
      setTimeout(() => navigate(`/timetable/${result.data.timetable._id}`), 2000);
    } else {
      setMessage({ type: 'error', text: result.error });
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="card mt-4">
        <div className="card-header">
          <h2 className="card-title">Generate Timetable</h2>
        </div>
        <div className="card-body">
          {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Select Batches (Hold Ctrl/Cmd to select multiple)</label>
              <select
                className="form-control"
                multiple
                value={selectedBatches}
                onChange={handleBatchChange}
                required
              >
                {batches.map(batch => (
                  <option key={batch._id} value={batch._id}>
                    {batch.batch_name} (Semester {batch.semester})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <label className="form-label">Academic Year</label>
                  <input
                    type="text"
                    className="form-control"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    placeholder="e.g., 2023-2024"
                    required
                  />
                </div>
              </div>
              <div className="form-col">
                <div className="form-group">
                  <label className="form-label">Semester</label>
                  <input
                    type="number"
                    className="form-control"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    required
                    min="1"
                    max="8"
                  />
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate Timetable'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TimetableGeneration;