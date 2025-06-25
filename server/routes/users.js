const express = require('express');
const User = require('../models/User');
const Article = require('../models/Article');
const { verifyToken, isAdmin } = require('../middleware/auth');
const router = express.Router();

// Get current user profile
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get public user profile
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const articles = await Article.find({ author: user._id, status: 'published' })
      .sort({ createdAt: -1 });
    res.json({ user, articles });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Create a new student
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const user = await User.create({ email, password, name, role: 'student' });
    console.log('New student created successfully:', user);
    res.status(201).json({ id: user._id, email: user.email, name: user.name, role: user.role });
  } catch (error) {
    console.error('Error creating new student:', error);
    res.status(400).json({ message: error.message });
  }
});

// Admin: List all students
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Delete a student
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Reset student password
router.post('/:id/reset-password', verifyToken, isAdmin, async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.password = password;
    await user.save();
    res.json({ message: 'Password reset' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update user profile (self or admin)
router.patch('/:id', verifyToken, async (req, res) => {
  // Allow user to update their own profile, or admin to update any profile
  if ((req.user._id !== req.params.id && req.user.id !== req.params.id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 