import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

const SubjectManagement = () => {
  const { subjects, faculty, fetchSubjects, fetchFaculty, addSubject, updateSubject, deleteSubject, loading } = useData();
  const [formData, setFormData] = useState({
    subject_name: '', subject_code: '', department: '', classes_per_week: '', assigned_faculty: [], type: 'lecture'
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchSubjects();
    fetchFaculty();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFacultyChange = (e) => {
    const { options } = e.target;
    const selectedFaculty = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setFormData({ ...formData, assigned_faculty: selectedFaculty });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;
    if (editingId) {
      result = await updateSubject(editingId, formData);
    } else {
      result = await addSubject(formData);
    }
    if (result.success) {
      setMessage({ type: 'success', text: `Subject ${editingId ? 'updated' : 'added'} successfully!` });
      resetForm();
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  };

  const handleEdit = (subject) => {
    setEditingId(subject._id);
    setFormData({
      subject_name: subject.subject_name,
      subject_code: subject.subject_code,
      department: subject.department,
      classes_per_week: subject.classes_per_week,
      assigned_faculty: subject.assigned_faculty.map(f => f._id),
      type: subject.type
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      const result = await deleteSubject(id);
      if (result.success) {
        setMessage({ type: 'success', text: 'Subject deleted successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      subject_name: '', subject_code: '', department: '', classes_per_week: '', assigned_faculty: [], type: 'lecture'
    });
  };

  return (
    <div className="container">
      <div className="card mt-4">
        <div className="card-header">
          <h2 className="card-title">{editingId ? 'Edit Subject' : 'Add New Subject'}</h2>
        </div>
        <div className="card-body">
          {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <label className="form-label">Subject Name</label>
                  <input type="text" className="form-control" name="subject_name" value={formData.subject_name} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-col">
                <div className="form-group">
                  <label className="form-label">Subject Code</label>
                  <input type="text" className="form-control" name="subject_code" value={formData.subject_code} onChange={handleChange} required />
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input type="text" className="form-control" name="department" value={formData.department} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-col">
                <div className="form-group">
                  <label className="form-label">Classes per Week</label>
                  <input type="number" className="form-control" name="classes_per_week" value={formData.classes_per_week} onChange={handleChange} required min="1" max="10" />
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select className="form-control" name="type" value={formData.type} onChange={handleChange}>
                    <option value="lecture">Lecture</option>
                    <option value="lab">Lab</option>
                    <option value="tutorial">Tutorial</option>
                  </select>
                </div>
              </div>
              <div className="form-col">
                <div className="form-group">
                  <label className="form-label">Assigned Faculty (Hold Ctrl/Cmd to select multiple)</label>
                  <select className="form-control" name="assigned_faculty" multiple value={formData.assigned_faculty} onChange={handleFacultyChange}>
                    {faculty.map(f => (
                      <option key={f._id} value={f._id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Add'} Subject</button>
              {editingId && <button type="button" className="btn btn-secondary ml-2" onClick={resetForm}>Cancel</button>}
            </div>
          </form>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">
          <h2 className="card-title">All Subjects</h2>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="loading">Loading subject data...</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Subject Code</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Classes/Week</th>
                  <th>Type</th>
                  <th>Assigned Faculty</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map(s => (
                  <tr key={s._id}>
                    <td>{s.subject_code}</td>
                    <td>{s.subject_name}</td>
                    <td>{s.department}</td>
                    <td>{s.classes_per_week}</td>
                    <td>{s.type}</td>
                    <td>{s.assigned_faculty.map(f => f.name).join(', ')}</td>
                    <td>
                      <button className="btn btn-sm btn-primary" onClick={() => handleEdit(s)}>Edit</button>
                      <button className="btn btn-sm btn-danger ml-2" onClick={() => handleDelete(s._id)}>Delete</button>
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

export default SubjectManagement;