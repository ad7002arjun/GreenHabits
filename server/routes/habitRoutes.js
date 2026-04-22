const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const auth = require('../middleware/auth');

// GET /api/habits - Get all habits for user
router.get('/', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.userId, isActive: true });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/habits - Create new habit
router.post('/', auth, async (req, res) => {
  try {
    const { name, category, description, impactPerAction, impactUnit } = req.body;

    const habit = new Habit({
      userId: req.userId,
      name,
      category,
      description,
      impactPerAction,
      impactUnit
    });

    await habit.save();
    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/habits/:id - Update habit
router.put('/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/habits/:id - Delete habit
router.delete('/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;