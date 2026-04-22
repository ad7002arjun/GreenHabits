const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['water', 'energy', 'transport', 'plastic', 'food', 'recycling']
  },
  description: {
    type: String,
    default: ''
  },
  impactPerAction: {
    type: Number,
    required: true
  },
  impactUnit: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  streak: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Habit', habitSchema);