import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [faculty, setFaculty] = useState([]);
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(false);

  // ---------------- Faculty operations ----------------
  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/data/faculty');
      setFaculty(response.data);
    } catch (error) {
      console.error('Error fetching faculty:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFaculty = async (facultyData) => {
    try {
      const response = await axios.post('/api/data/faculty', facultyData);
      setFaculty([...faculty, response.data]);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add faculty'
      };
    }
  };

  const updateFaculty = async (id, facultyData) => {
    try {
      const response = await axios.put(`/api/data/faculty/${id}`, facultyData);
      setFaculty(faculty.map(f => f._id === id ? response.data : f));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update faculty'
      };
    }
  };

  const deleteFaculty = async (id) => {
    try {
      await axios.delete(`/api/data/faculty/${id}`);
      setFaculty(faculty.filter(f => f._id !== id));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete faculty'
      };
    }
  };

  // ---------------- Batch operations ----------------
  const fetchBatches = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/data/batch');
      setBatches(response.data);
    } catch (error) {
      console.error('Error fetching batches:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBatch = async (batchData) => {
    try {
      const response = await axios.post('/api/data/batch', batchData);
      setBatches([...batches, response.data]);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add batch'
      };
    }
  };

  const updateBatch = async (id, batchData) => {
    try {
      const response = await axios.put(`/api/data/batch/${id}`, batchData);
      setBatches(batches.map(b => b._id === id ? response.data : b));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update batch'
      };
    }
  };

  const deleteBatch = async (id) => {
    try {
      await axios.delete(`/api/data/batch/${id}`);
      setBatches(batches.filter(b => b._id !== id));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete batch'
      };
    }
  };

  // ---------------- Subject operations ----------------
  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/data/subject');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSubject = async (subjectData) => {
    try {
      const response = await axios.post('/api/data/subject', subjectData);
      setSubjects([...subjects, response.data]);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add subject'
      };
    }
  };

  const updateSubject = async (id, subjectData) => {
    try {
      const response = await axios.put(`/api/data/subject/${id}`, subjectData);
      setSubjects(subjects.map(s => s._id === id ? response.data : s));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update subject'
      };
    }
  };

  const deleteSubject = async (id) => {
    try {
      await axios.delete(`/api/data/subject/${id}`);
      setSubjects(subjects.filter(s => s._id !== id));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete subject'
      };
    }
  };

  // ---------------- Classroom operations ----------------
  const fetchClassrooms = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/data/classroom');
      setClassrooms(response.data);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const addClassroom = async (classroomData) => {
    try {
      const response = await axios.post('/api/data/classroom', classroomData);
      setClassrooms([...classrooms, response.data]);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add classroom'
      };
    }
  };

  const updateClassroom = async (id, classroomData) => {
    try {
      const response = await axios.put(`/api/data/classroom/${id}`, classroomData);
      setClassrooms(classrooms.map(c => c._id === id ? response.data : c));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update classroom'
      };
    }
  };

  const deleteClassroom = async (id) => {
    try {
      await axios.delete(`/api/data/classroom/${id}`);
      setClassrooms(classrooms.filter(c => c._id !== id));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete classroom'
      };
    }
  };

  // ---------------- Timetable operations ----------------
  const fetchTimetables = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/timetable');
      setTimetables(response.data);
    } catch (error) {
      console.error('Error fetching timetables:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTimetable = async (timetableData) => {
    try {
      const response = await axios.post('/api/timetable/generate', timetableData);
      await fetchTimetables(); // Refresh list
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to generate timetable'
      };
    }
  };

  const approveTimetable = async (id) => {
    try {
      const response = await axios.put(`/api/timetable/${id}/approve`);
      setTimetables(timetables.map(t => t._id === id ? response.data.timetable : t));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to approve timetable'
      };
    }
  };

  const deleteTimetable = async (id) => {
    try {
      await axios.delete(`/api/timetable/${id}`);
      setTimetables(timetables.filter(t => t._id !== id));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete timetable'
      };
    }
  };

  // ---------------- Value exposed to context ----------------
  const value = {
    faculty,
    batches,
    subjects,
    classrooms,
    timetables,
    loading,
    fetchFaculty,
    addFaculty,
    updateFaculty,
    deleteFaculty,
    fetchBatches,
    addBatch,
    updateBatch,
    deleteBatch,
    fetchSubjects,
    addSubject,
    updateSubject,
    deleteSubject,
    fetchClassrooms,
    addClassroom,
    updateClassroom,
    deleteClassroom,
    fetchTimetables,
    generateTimetable,
    approveTimetable,
    deleteTimetable
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
