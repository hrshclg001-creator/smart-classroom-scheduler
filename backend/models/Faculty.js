const mongoose = require('mongoose');

const AvailabilitySlotSchema = new mongoose.Schema({
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

const FacultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  subjects_taught: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  workload: {
    type: Number,
    default: 20, // classes per week
    min: 1,
    max: 40
  },
  availability_schedule: [AvailabilitySlotSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Faculty', FacultySchema);