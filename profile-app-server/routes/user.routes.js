const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/User.model');

// GET /api/users -  Retrieves the current user
router.get('/users', async (req, res, next) => {
  try {
    // console.log('req.payload', req.payload);
    const currentUser = await User.findById(req.payload._id);
    // console.log('current user:', currentUser);
    if (!currentUser) {
      // If the current user is not found, send an error response
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.json(currentUser);
  } catch (error) {
    console.log('Error fetching current user:', error);
    return res.status(500).json({ message: 'Error fetching current user' });
  }
});

// PUT /api/users - Updates the current user image
router.put('/users', async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.payload._id)) {
    return res.status(400).json({ message: 'Specified user ID is not valid' });
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.payload._id,
      { image: req.body.image },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(updatedUser);
  } catch (error) {
    console.log('Error updating current user:', error);
    return res.status(500).json({ message: 'Error updating current user' });
  }
});

// POST/api/upload 

module.exports = router;