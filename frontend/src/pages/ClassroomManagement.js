import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

const ClassroomManagement = () => {
  const { classrooms, fetchClassrooms, addClassroom, updateClassroom, deleteClassroom, loading } = useData();
  const [formData, setFormData] = useState({
    room_number: '', type: 'Lecture Hall', capacity: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;
    if (editingId) {
      result = await updateClassroom(editingId, formData);
    } else {
      result = await addClassroom(formData);
    }
    if (result.success) {
      setMessage({ type: 'success', text: `Classroom ${editingId ? 'updated' : 'added'} successfully!` });
      resetForm();
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  };

  const handleEdit = (classroom) => {
    setEditingId(classroom._id);
    setFormData({
      room_number: classroom.room_number,
      type: classroom.type,
      capacity: classroom.capacity,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this classroom?')) {
      const result = await deleteClassroom(id);
      if (result.success) {
        setMessage({ type: 'success', text: 'Classroom deleted successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ room_number: '', type: 'Lecture Hall', capacity: '' });
  };

  return (
    <div className="container">
      <div className="card mt-4">
        <div className="card-header">
          <h2 className="card-title">{editingId ? 'Edit Classroom' : 'Add New Classroom'}</h2>
        </div>
        <div className="card-body">
          {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Room Number</label>
              <input type="text" className="form-control" name="room_number" value={formData.room_number} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-control" name="type" value={formData.type} onChange={handleChange}>
                <option value="Lecture Hall">Lecture Hall</option>
                <option value="Lab">Lab</option>
                <option value="Tutorial Room">Tutorial Room</option>
                <option value="Auditorium">Auditorium</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Capacity</label>
              <input type="number" className="form-control" name="capacity" value={formData.capacity} onChange={handleChange} required min="1" />
            </div>
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Add'} Classroom</button>
              {editingId && <button type="button" className="btn btn-secondary ml-2" onClick={resetForm}>Cancel</button>}
            </div>
          </form>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">
          <h2 className="card-title">All Classrooms</h2>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="loading">Loading classroom data...</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Room Number</th>
                  <th>Type</th>
                  <th>Capacity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {classrooms.map(c => (
                  <tr key={c._id}>
                    <td>{c.room_number}</td>
                    <td>{c.type}</td>
                    <td>{c.capacity}</td>
                    <td>
                      <button className="btn btn-sm btn-primary" onClick={() => handleEdit(c)}>Edit</button>
                      <button className="btn btn-sm btn-danger ml-2" onClick={() => handleDelete(c._id)}>Delete</button>
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

export default ClassroomManagement;