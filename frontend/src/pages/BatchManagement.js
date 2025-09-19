import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

const BatchManagement = () => {
  const { batches, subjects, fetchBatches, fetchSubjects, addBatch, updateBatch, deleteBatch, loading } = useData();
  const [formData, setFormData] = useState({
    batch_name: '', semester: '', subjects_enrolled: [], students_count: '', department: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
  fetchBatches();
  fetchSubjects();
}, [fetchBatches, fetchSubjects]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubjectChange = (e) => {
    const { options } = e.target;
    const selectedSubjects = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setFormData({ ...formData, subjects_enrolled: selectedSubjects });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;
    if (editingId) {
      result = await updateBatch(editingId, formData);
    } else {
      result = await addBatch(formData);
    }
    if (result.success) {
      setMessage({ type: 'success', text: `Batch ${editingId ? 'updated' : 'added'} successfully!` });
      resetForm();
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  };

  const handleEdit = (batch) => {
    setEditingId(batch._id);
    setFormData({
      batch_name: batch.batch_name,
      semester: batch.semester,
      subjects_enrolled: batch.subjects_enrolled.map(s => s._id),
      students_count: batch.students_count,
      department: batch.department
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      const result = await deleteBatch(id);
      if (result.success) {
        setMessage({ type: 'success', text: 'Batch deleted successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ batch_name: '', semester: '', subjects_enrolled: [], students_count: '', department: '' });
  };

  return (
    <div className="container">
      <div className="card mt-4">
        <div className="card-header">
          <h2 className="card-title">{editingId ? 'Edit Batch' : 'Add New Batch'}</h2>
        </div>
        <div className="card-body">
          {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Batch Name</label>
              <input type="text" className="form-control" name="batch_name" value={formData.batch_name} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <label className="form-label">Semester</label>
                  <input type="number" className="form-control" name="semester" value={formData.semester} onChange={handleChange} required min="1" max="8" />
                </div>
              </div>
              <div className="form-col">
                <div className="form-group">
                  <label className="form-label">Students Count</label>
                  <input type="number" className="form-control" name="students_count" value={formData.students_count} onChange={handleChange} required min="1" />
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <input type="text" className="form-control" name="department" value={formData.department} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Subjects Enrolled (Hold Ctrl/Cmd to select multiple)</label>
              <select
                className="form-control"
                name="subjects_enrolled"
                multiple
                value={formData.subjects_enrolled}
                onChange={handleSubjectChange}
              >
                {subjects.map(subject => (
                  <option key={subject._id} value={subject._id}>
                    {subject.subject_name} ({subject.subject_code})
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Add'} Batch</button>
              {editingId && <button type="button" className="btn btn-secondary ml-2" onClick={resetForm}>Cancel</button>}
            </div>
          </form>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">
          <h2 className="card-title">All Batches</h2>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="loading">Loading batch data...</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Batch Name</th>
                  <th>Semester</th>
                  <th>Department</th>
                  <th>Students</th>
                  <th>Subjects</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {batches.map(b => (
                  <tr key={b._id}>
                    <td>{b.batch_name}</td>
                    <td>{b.semester}</td>
                    <td>{b.department}</td>
                    <td>{b.students_count}</td>
                    <td>{b.subjects_enrolled.map(s => s.subject_code).join(', ')}</td>
                    <td>
                      <button className="btn btn-sm btn-primary" onClick={() => handleEdit(b)}>Edit</button>
                      <button className="btn btn-sm btn-danger ml-2" onClick={() => handleDelete(b._id)}>Delete</button>
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

export default BatchManagement;