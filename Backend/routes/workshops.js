const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Workshop = require('../models/Workshop');

// Create a new workshop (protected route)
router.post('/workshops', authMiddleware, async (req, res) => {
  try {
    const { title, description, date, durationHours, mentors } = req.body;

    if (!title || !date || !durationHours) {
      return res.status(400).json({ msg: 'Title, date, and duration are required' });
    }

    const newWorkshop = new Workshop({
      title,
      description,
      date,
      durationHours,
      mentors,
      status: 'scheduled',
    });

    const savedWorkshop = await newWorkshop.save();
    res.status(201).json(savedWorkshop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all workshops (protected route)
router.get('/workshops', authMiddleware, async (req, res) => {
  try {
    const workshops = await Workshop.find()
      .populate('mentors', 'name email')
      .populate('participants', 'name email');

    res.json(workshops);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Register participant to a workshop (protected route)
router.post('/workshops/:id/register', authMiddleware, async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) return res.status(404).json({ msg: 'Workshop not found' });

    if (workshop.participants.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Already registered' });
    }

    workshop.participants.push(req.user.id);
    await workshop.save();

    res.json({ msg: 'Registered to workshop successfully', workshop });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Assign mentor to a workshop (protected route)
router.post('/workshops/:id/assign-mentor', authMiddleware, async (req, res) => {
  try {
    const { mentorId } = req.body;
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) return res.status(404).json({ msg: 'Workshop not found' });

    if (workshop.mentors.includes(mentorId)) {
      return res.status(400).json({ msg: 'Mentor already assigned' });
    }

    workshop.mentors.push(mentorId);
    await workshop.save();

    res.json({ msg: 'Mentor assigned successfully', workshop });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
