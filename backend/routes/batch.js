const express = require('express');
const StudentBatch = require('../models/StudentBatch');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all batches
router.get('/', auth, async (req, res) => {
  try {
    const batches = await StudentBatch.find().populate('subjects_enrolled');
    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get batch by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const batch = await StudentBatch.findById(req.params.id).populate('subjects_enrolled');
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    res.json(batch);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create batch
router.post('/', auth, authorize('admin', 'dean'), async (req, res) => {
  try {
    const batch = new StudentBatch(req.body);
    await batch.save();
    res.status(201).json(batch);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Batch name already exists' });
    } else {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
});

// Update batch
router.put('/:id', auth, authorize('admin', 'dean'), async (req, res) => {
  try {
    const batch = await StudentBatch.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('subjects_enrolled');
    
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    
    res.json(batch);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete batch
router.delete('/:id', auth, authorize('admin', 'dean'), async (req, res) => {
  try {
    const batch = await StudentBatch.findByIdAndDelete(req.params.id);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    res.json({ message: 'Batch deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;