const mongoose = require('mongoose');

const TimetableSlotSchema = new mongoose.Schema({
  batch_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentBatch',
    required: true
  },
  faculty_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true
  },
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  classroom_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true
  },
  day_of_week: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true
  },
  time_slot: {
    start: {
      type: String,
      required: true // "09:00"
    },
    end: {
      type: String,
      required: true // "10:00"
    }
  },
  timetable_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Timetable',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TimetableSlot', TimetableSlotSchema);