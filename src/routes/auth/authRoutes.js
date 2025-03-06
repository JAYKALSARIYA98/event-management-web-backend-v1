const express = require('express');
const { body } = require('express-validator');
const { signup, signin, forgotPassword, resetPassword, Whoiam } = require('./authController');
const auth = require('../../middleware/auth');

const router = express.Router();

// Validation middleware
const signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const signinValidation = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/signup', signupValidation, signup);
router.post('/signin', signinValidation, signin);
router.post('/forgot-password', body('email').isEmail(), forgotPassword);
router.post('/reset-password', [
  body('email').isEmail(),
  body('otp').isLength({ min: 6, max: 6 }),
  body('newPassword').isLength({ min: 6 })
], resetPassword);
router.get('/whoami', auth, Whoiam)
module.exports = router;