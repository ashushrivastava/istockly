// backend/routes/adminLivePrograms.js
// Admin routes for managing live programs

const express = require('express');
const router = express.Router();
const LiveProgram = require('../models/LiveProgram');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(requireAuth);
router.use(requireAdmin);

// Get all programs (including unpublished)
router.get('/', async (req, res) => {
  try {
    const programs = await LiveProgram.find()
      .sort({ createdAt: -1 });
    res.json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ error: 'Failed to fetch programs' });
  }
});

// Get single program by ID
router.get('/:id', async (req, res) => {
  try {
    const program = await LiveProgram.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }
    res.json(program);
  } catch (error) {
    console.error('Error fetching program:', error);
    res.status(500).json({ error: 'Failed to fetch program' });
  }
});

// Create new program
router.post('/', async (req, res) => {
  try {
    const programData = req.body;
    
    // Generate slug if not provided
    if (!programData.slug && programData.title) {
      programData.slug = programData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const program = new LiveProgram(programData);
    await program.save();
    
    res.status(201).json(program);
  } catch (error) {
    console.error('Create program error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        error: 'A program with this slug already exists' 
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        error: 'Validation failed',
        details: messages 
      });
    }
    
    res.status(400).json({ error: error.message });
  }
});

// Update program
router.put('/:id', async (req, res) => {
  try {
    const program = await LiveProgram.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }
    
    res.json(program);
  } catch (error) {
    console.error('Update program error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Toggle publish status
router.patch('/:id/toggle-publish', async (req, res) => {
  try {
    const program = await LiveProgram.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }
    
    program.isPublished = !program.isPublished;
    await program.save();
    
    res.json(program);
  } catch (error) {
    console.error('Toggle publish error:', error);
    res.status(500).json({ error: 'Failed to update program' });
  }
});

// Delete program
router.delete('/:id', async (req, res) => {
  try {
    const program = await LiveProgram.findByIdAndDelete(req.params.id);
    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }
    res.json({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Delete program error:', error);
    res.status(500).json({ error: 'Failed to delete program' });
  }
});

module.exports = router;