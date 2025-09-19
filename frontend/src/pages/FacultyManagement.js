import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

const FacultyManagement = () => {
  const { faculty, subjects, fetchFaculty, fetchSubjects, addFaculty, updateFaculty, deleteFaculty, loading } = useData();
  const [formData, setFormData] = useState({
    name: '', email: '', department: '', subjects_taught: [], workload: 20
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchFaculty();
    fetchSubjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubjectChange = (e) => {
    const { options } = e.target;
    const selectedSubjects = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setFormData({ ...formData, subjects_taught: selectedSubjects });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;
    if (editingId) {
      result = await updateFaculty(editingId, formData);
    } else {
      result = await addFaculty(formData);
    }
    if (result.success) {
      setMessage({ type: 'success', text: `Faculty ${editingId ? 'updated' : 'added'} successfully!` });
      resetForm();
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  };

  const handleEdit = (facultyMember) => {
    setEditingId(facultyMember._id);
    setFormData({
      name: facultyMember.name,
      email: facultyMember.email,
      department: facultyMember.department,
      subjects_taught: facultyMember.subjects_taught.map(s => s._id),
      workload: facultyMember.workload
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      const result = await deleteFaculty(id);
      if (result.success) {
        setMessage({ type: 'success', text: 'Faculty deleted successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', department: '', subjects_taught: [], workload: 20 });
  };

  return (
    <div className="container">
      <div className="card mt-4">
        <div className="card-header">
          <h2 className="card-title">{editingId ? 'Edit Faculty' : 'Add New Faculty'}</h2>
        </div>
        <div className="card-body">
          {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <input
                type="text"
                className="form-control"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Subjects Taught (Hold Ctrl/Cmd to select multiple)</label>
              <select
                className="form-control"
                name="subjects_taught"
                multiple
                value={formData.subjects_taught}
                onChange={handleSubjectChange}
              >
                {subjects.map(subject => (
                  <option key={subject._id} value={subject._id}>
                    {subject.subject_name} ({subject.subject_code})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Workload (Classes per week)</label>
              <input
                type="number"
                className="form-control"
                name="workload"
                value={formData.workload}
                onChange={handleChange}
                min="1"
                max="40"
              />
            </div>
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update' : 'Add'} Faculty
              </button>
              {editingId && (
                <button type="button" className="btn btn-secondary ml-2" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">
          <h2 className="card-title">All Faculty</h2>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="loading">Loading faculty data...</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Subjects</th>
                  <th>Workload</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {faculty.map(f => (
                  <tr key={f._id}>
                    <td>{f.name}</td>
                    <td>{f.email}</td>
                    <td>{f.department}</td>
                    <td>{f.subjects_taught.map(s => s.subject_code).join(', ')}</td>
                    <td>{f.workload}</td>
                    <td>
                      <button className="btn btn-sm btn-primary" onClick={() => handleEdit(f)}>Edit</button>
                      <button className="btn btn-sm btn-danger ml-2" onClick={() => handleDelete(f._id)}>Delete</button>
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

export default FacultyManagement;