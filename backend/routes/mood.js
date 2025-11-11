const express = require('express');
const jwt = require('jsonwebtoken');
const UserMoodEntry = require('../models/UserMoodEntry');
const Mood = require('../models/Mood');

const router = express.Router();

// POST /api/mood
router.post('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Authentication required' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { moodId } = req.body;
    const mood = await Mood.findById(moodId);
    if (!mood) return res.status(400).json({ message: 'Invalid mood' });
    const entry = new UserMoodEntry({ user: decoded.id, mood: mood._id });
    await entry.save();
    res.status(201).json({ message: 'Mood recorded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
