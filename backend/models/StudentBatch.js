const mongoose = require('mongoose');

const StudentBatchSchema = new mongoose.Schema({
  batch_name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  subjects_enrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  students_count: {
    type: Number,
    required: true,
    min: 1
  },
  department: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('StudentBatch', StudentBatchSchema);