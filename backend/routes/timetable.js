const express = require('express');
const Timetable = require('../models/Timetable');
const TimetableSlot = require('../models/TimetableSlot');
const StudentBatch = require('../models/StudentBatch');
const Faculty = require('../models/Faculty');
const Subject = require('../models/Subject');
const Classroom = require('../models/Classroom');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Timetable generation algorithm
const generateTimetable = async (batches, academicYear, semester) => {
  const timeSlots = [
    { start: '09:00', end: '10:00' },
    { start: '10:00', end: '11:00' },
    { start: '11:00', end: '12:00' },
    { start: '12:00', end: '13:00' },
    { start: '14:00', end: '15:00' },
    { start: '15:00', end: '16:00' },
    { start: '16:00', end: '17:00' },
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const slots = [];
  const conflicts = {
    faculty: new Map(),
    classroom: new Map(),
    batch: new Map()
  };

  // Get all required data
  const batchData = await StudentBatch.find({ _id: { $in: batches } }).populate('subjects_enrolled');
  const facultyData = await Faculty.find().populate('subjects_taught');
  const classroomData = await Classroom.find();
  const subjectData = await Subject.find().populate('assigned_faculty');

  // Create a mapping for quick lookup
  const facultyMap = new Map(facultyData.map(f => [f._id.toString(), f]));
  const classroomMap = new Map(classroomData.map(c => [c._id.toString(), c]));

  // Generate slots for each batch
  for (const batch of batchData) {
    for (const subjectId of batch.subjects_enrolled) {
      const subject = subjectData.find(s => s._id.toString() === subjectId.toString());
      if (!subject || !subject.assigned_faculty.length) continue;

      // Try to schedule required classes for this subject
      let scheduledClasses = 0;
      const requiredClasses = subject.classes_per_week;

      for (const day of days) {
        if (scheduledClasses >= requiredClasses) break;

        for (const timeSlot of timeSlots) {
          if (scheduledClasses >= requiredClasses) break;

          // Find available faculty
          const availableFaculty = subject.assigned_faculty.find(facultyId => {
            const faculty = facultyMap.get(facultyId.toString());
            if (!faculty) return false;

            const conflictKey = `${faculty._id}-${day}-${timeSlot.start}`;
            return !conflicts.faculty.has(conflictKey);
          });

          if (!availableFaculty) continue;

          // Find available classroom
          const availableClassroom = classroomData.find(classroom => {
            if (classroom.capacity < batch.students_count) return false;
            
            const conflictKey = `${classroom._id}-${day}-${timeSlot.start}`;
            return !conflicts.classroom.has(conflictKey);
          });

          if (!availableClassroom) continue;

          // Check batch availability
          const batchConflictKey = `${batch._id}-${day}-${timeSlot.start}`;
          if (conflicts.batch.has(batchConflictKey)) continue;

          // Create the slot
          const slot = {
            batch_id: batch._id,
            faculty_id: availableFaculty,
            subject_id: subject._id,
            classroom_id: availableClassroom._id,
            day_of_week: day,
            time_slot: timeSlot
          };

          slots.push(slot);
          scheduledClasses++;

          // Mark conflicts
          conflicts.faculty.set(`${availableFaculty}-${day}-${timeSlot.start}`, true);
          conflicts.classroom.set(`${availableClassroom._id}-${day}-${timeSlot.start}`, true);
          conflicts.batch.set(`${batch._id}-${day}-${timeSlot.start}`, true);
        }
      }
    }
  }

  return slots;
};

// Generate timetable
router.post('/generate', auth, authorize('admin', 'dean'), async (req, res) => {
  try {
    const { batches, academicYear, semester, name } = req.body;

    if (!batches || !batches.length) {
      return res.status(400).json({ message: 'Batches are required' });
    }

    // Generate timetable slots
    const slots = await generateTimetable(batches, academicYear, semester);

    // Create timetable record
    const timetable = new Timetable({
      name: name || `Timetable ${new Date().toISOString().split('T')[0]}`,
      semester,
      academic_year: academicYear || new Date().getFullYear().toString(),
      created_by: req.user._id,
      batches
    });

    await timetable.save();

    // Save all slots
    const slotsWithTimetableId = slots.map(slot => ({
      ...slot,
      timetable_id: timetable._id
    }));

    await TimetableSlot.insertMany(slotsWithTimetableId);

    res.status(201).json({
      message: 'Timetable generated successfully',
      timetable,
      slotsCount: slots.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all timetables
router.get('/', auth, async (req, res) => {
  try {
    const timetables = await Timetable.find()
      .populate('created_by', 'username email')
      .populate('approved_by', 'username email')
      .populate('batches')
      .sort('-createdAt');
    
    res.json(timetables);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get timetable by ID with slots
router.get('/:id', auth, async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id)
      .populate('created_by', 'username email')
      .populate('approved_by', 'username email')
      .populate('batches');

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    const slots = await TimetableSlot.find({ timetable_id: req.params.id })
      .populate('batch_id')
      .populate('faculty_id')
      .populate('subject_id')
      .populate('classroom_id');

    res.json({ timetable, slots });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Save timetable (mark as saved)
router.post('/save', auth, authorize('admin', 'dean'), async (req, res) => {
  try {
    const { timetableId } = req.body;
    
    const timetable = await Timetable.findByIdAndUpdate(
      timetableId,
      { status: 'draft' },
      { new: true }
    );

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    res.json({ message: 'Timetable saved successfully', timetable });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve timetable
router.put('/:id/approve', auth, authorize('dean', 'admin'), async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'approved',
        approved_by: req.user._id,
        approval_date: new Date()
      },
      { new: true }
    ).populate('approved_by', 'username email');

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    res.json({ message: 'Timetable approved successfully', timetable });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete timetable
router.delete('/:id', auth, authorize('admin', 'dean'), async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndDelete(req.params.id);
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    // Delete associated slots
    await TimetableSlot.deleteMany({ timetable_id: req.params.id });

    res.json({ message: 'Timetable deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;