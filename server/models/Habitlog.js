const mongoose = require('mongoose');

const habitLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  impactValue: {
    type: Number,
    required: true
  },
  note: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('HabitLog', habitLogSchema);