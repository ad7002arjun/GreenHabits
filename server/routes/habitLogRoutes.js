const express = require('express');
const router = express.Router();
const HabitLog = require('../models/Habitlog');
const Habit = require('../models/Habit');
const User = require('../models/User');
const auth = require('../middleware/auth');

// POST /api/logs - Log a habit completion
router.post('/', auth, async (req, res) => {
  try {
    const { habitId, date, quantity, note } = req.body;

    const habit = await Habit.findOne({ _id: habitId, userId: req.userId });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const existingLog = await HabitLog.findOne({
      userId: req.userId,
      habitId,
      date
    });

    if (existingLog) {
      return res.status(400).json({ message: 'Habit already logged for this date' });
    }

    const impactValue = habit.impactPerAction * (quantity || 1);

    const log = new HabitLog({
      userId: req.userId,
      habitId,
      date,
      quantity: quantity || 1,
      impactValue,
      note: note || ''
    });

    await log.save();

    // Update streak
    habit.streak += 1;
    await habit.save();

    // Update user total impact
    await User.findByIdAndUpdate(req.userId, {
      $inc: { totalImpactScore: impactValue }
    });

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/logs - Get logs for user
router.get('/', auth, async (req, res) => {
  try {
    const { date, habitId } = req.query;
    let filter = { userId: req.userId };

    if (date) filter.date = date;
    if (habitId) filter.habitId = habitId;

    const logs = await HabitLog.find(filter)
      .populate('habitId', 'name category impactUnit')
      .sort({ date: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/logs/stats - Get impact stats
router.get('/stats', auth, async (req, res) => {
  try {
    const logs = await HabitLog.find({ userId: req.userId }).populate('habitId', 'category');

    const totalLogs = logs.length;
    const totalImpact = logs.reduce((sum, log) => sum + log.impactValue, 0);

    const categoryStats = {};
    logs.forEach(log => {
      if (log.habitId) {
        const cat = log.habitId.category;
        if (!categoryStats[cat]) {
          categoryStats[cat] = { count: 0, totalImpact: 0 };
        }
        categoryStats[cat].count += 1;
        categoryStats[cat].totalImpact += log.impactValue;
      }
    });

    // Last 7 days activity
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLogs = logs.filter(l => l.date === dateStr);
      last7Days.push({
        date: dateStr,
        count: dayLogs.length,
        impact: dayLogs.reduce((s, l) => s + l.impactValue, 0)
      });
    }

    res.json({
      totalLogs,
      totalImpact,
      categoryStats,
      last7Days
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/logs/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const log = await HabitLog.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }
    res.json({ message: 'Log deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;