const mongoose = require('mongoose');

const userMoodEntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood: { type: mongoose.Schema.Types.ObjectId, ref: 'Mood', required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserMoodEntry', userMoodEntrySchema);
