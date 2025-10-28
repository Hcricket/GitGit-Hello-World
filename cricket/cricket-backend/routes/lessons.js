const express = require('express');
const Lesson = require('../models/Lesson');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get lessons by room
router.get('/room/:roomId', auth, async (req, res) => {
  try {
    const lessons = await Lesson.find({ roomId: req.params.roomId }).sort({ order: 1 });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single lesson
router.get('/:id', auth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;