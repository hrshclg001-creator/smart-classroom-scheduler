const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  subject_name: {
    type: String,
    required: true,
    trim: true
  },
  subject_code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  classes_per_week: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  assigned_faculty: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty'
  }],
  type: {
    type: String,
    enum: ['lecture', 'lab', 'tutorial'],
    default: 'lecture'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subject', SubjectSchema);