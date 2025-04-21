const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, verifyEmail } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post('/', register);

// @route   POST api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

// @route   POST api/users/verify-email
// @desc    Verify user email
// @access  Public
router.post('/verify-email', verifyEmail);

// @route   GET api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, getProfile);

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, updateProfile);

module.exports = router;