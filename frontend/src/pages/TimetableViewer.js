import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const TimetableViewer = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [timetable, setTimetable] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00',
    '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00'
  ];

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/timetable/${id}`);
        setTimetable(response.data.timetable);
        setSlots(response.data.slots);
        setError(null);
      } catch (err) {
        setError('Failed to fetch timetable. Please check the ID.');
        setTimetable(null);
        setSlots([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, [id]);

  const getSlotDetails = (day, timeSlot) => {
    const [start, end] = timeSlot.split(' - ');
    return slots.find(s =>
      s.day_of_week === day &&
      s.time_slot.start === start &&
      s.time_slot.end === end
    );
  };

  if (loading) {
    return <div className="loading">Loading timetable...</div>;
  }

  if (error) {
    return <div className="container mt-4 alert alert-error">{error}</div>;
  }

  if (!timetable) {
    return <div className="container mt-4 alert alert-error">Timetable not found.</div>;
  }

  return (
    <div className="container timetable-viewer">
      <div className="card mt-4">
        <div className="card-header">
          <h2 className="card-title">Timetable for {timetable.batches.map(b => b.batch_name).join(', ')}</h2>
          <p className="card-subtitle mb-0">
            Status: **{timetable.status.toUpperCase()}** | Created by: {timetable.created_by.username}
          </p>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <div className="timetable-grid" style={{ gridTemplateColumns: `repeat(${days.length + 1}, 1fr)` }}>
              <div className="timetable-header">Time / Day</div>
              {days.map(day => <div key={day} className="timetable-header">{day}</div>)}
              {timeSlots.map(timeSlot => (
                <React.Fragment key={timeSlot}>
                  <div className="timetable-cell timetable-header">{timeSlot}</div>
                  {days.map(day => {
                    const slot = getSlotDetails(day, timeSlot);
                    return (
                      <div
                        key={`${day}-${timeSlot}`}
                        className={`timetable-cell ${slot ? 'has-class' : ''}`}
                      >
                        {slot ? (
                          <div className="slot-details">
                            <strong>{slot.subject_id.subject_code}</strong>
                            <br />
                            <small>{slot.subject_id.subject_name}</small>
                            <br />
                            <small>Faculty: {slot.faculty_id.name}</small>
                            <br />
                            <small>Room: {slot.classroom_id.room_number}</small>
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetableViewer;