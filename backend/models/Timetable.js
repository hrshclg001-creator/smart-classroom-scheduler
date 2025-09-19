const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  academic_year: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'approved', 'rejected'],
    default: 'draft'
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approved_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approval_date: {
    type: Date
  },
  batches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentBatch'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Timetable', TimetableSchema);