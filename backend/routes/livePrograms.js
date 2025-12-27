// backend/routes/livePrograms.js
// Public routes for live programs

const express = require('express');
const router = express.Router();
const LiveProgram = require('../models/LiveProgram');

// Get all live programs with optional filtering
router.get('/', async (req, res) => {
  try {
    const { type, status, featured } = req.query;
    const filter = { isPublished: true };
    
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (featured === 'true') filter.isFeatured = true;

    const programs = await LiveProgram.find(filter)
      .sort({ sessionDate: 1, createdAt: -1 });
    
    res.json(programs);
  } catch (error) {
    console.error('Error fetching live programs:', error);
    res.status(500).json({ error: 'Failed to fetch live programs' });
  }
});

// Get programs by type
router.get('/type/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const programs = await LiveProgram.find({ 
      type, 
      isPublished: true 
    }).sort({ sessionDate: 1, createdAt: -1 });
    
    res.json(programs);
  } catch (error) {
    console.error('Error fetching programs by type:', error);
    res.status(500).json({ error: 'Failed to fetch programs' });
  }
});

// Get single program by slug
router.get('/:slug', async (req, res) => {
  try {
    const program = await LiveProgram.findOne({ 
      slug: req.params.slug,
      isPublished: true 
    });
    
    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }
    
    res.json(program);
  } catch (error) {
    console.error('Error fetching program:', error);
    res.status(500).json({ error: 'Failed to fetch program' });
  }
});

module.exports = router;