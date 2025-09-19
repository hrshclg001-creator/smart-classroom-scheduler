const mongoose = require('mongoose');

const ClassroomAvailabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true
  },
  timeSlots: [{
    start: String, // "09:00"
    end: String    // "10:00"
  }]
});

const ClassroomSchema = new mongoose.Schema({
  room_number: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Lecture Hall', 'Lab', 'Tutorial Room', 'Auditorium'],
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  availability_schedule: [ClassroomAvailabilitySchema],
  department: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Classroom', ClassroomSchema);