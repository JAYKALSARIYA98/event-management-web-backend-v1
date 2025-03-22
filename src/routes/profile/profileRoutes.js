const express = require('express');
const { body } = require('express-validator');
const auth = require('../../middleware/auth');
const { 
  createProfile, 
  getProfile, 
  updateProfile,
  getUserEvents
} = require('./profileController');

const router = express.Router();

// Profile validation middleware
const profileValidation = [
  body('phoneNumber')
    .matches(/^\+?[\d\s-]+$/)
    .withMessage('Valid phone number is required'),
  body('enrollmentNumber')
    .notEmpty()
    .withMessage('Enrollment number is required'),
  body('birthdate')
    .isISO8601()
    .withMessage('Valid birthdate is required'),
  body('class')
    .notEmpty()
    .withMessage('Class is required'),
  body('year')
    .isInt({ min: 1, max: 5 })
    .withMessage('Year must be between 1 and 5'),
  body('semester')
    .isInt({ min: 1, max: 10 })
    .withMessage('Semester must be between 1 and 10')
];

// Protected routes - all profile routes require authentication
router.post('/', [auth, profileValidation], createProfile);
router.get('/', auth, getProfile);
router.put('/', [auth, profileValidation], updateProfile);
router.get('/events', auth, getUserEvents);

module.exports = router; 