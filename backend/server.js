const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const facultyRoutes = require('./routes/faculty');
const batchRoutes = require('./routes/batch');
const subjectRoutes = require('./routes/subject');
const classroomRoutes = require('./routes/classroom');
const timetableRoutes = require('./routes/timetable');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/data/faculty', facultyRoutes);
app.use('/api/data/batch', batchRoutes);
app.use('/api/data/subject', subjectRoutes);
app.use('/api/data/classroom', classroomRoutes);
app.use('/api/timetable', timetableRoutes);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-classroom', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('MongoDB connection error:', err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});