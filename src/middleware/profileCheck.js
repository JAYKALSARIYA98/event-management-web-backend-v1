const User = require('../models/User');

/**
 * Middleware to check if a user has completed their profile
 * This is used to ensure students have completed their profiles before registering for events
 */
const profileCheck = async (req, res, next) => {
  try {
    console.log("Profile Check - Request User:", req.user);
    
    // Get user ID from auth middleware
    const userId = req.user.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'User ID not found in token' });
    }

    // Find the user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // If user is not a student, let them pass (only students need profiles)
    if (user.role !== 'Student') {
      return next();
    }
    
    // Check if student has completed their profile
    if (!user.hasCompletedProfile) {
      return res.status(403).json({ 
        message: 'You must complete your profile before accessing this resource',
        profileRequired: true
      });
    }
    
    // User has a profile, proceed to the next middleware
    next();
  } catch (error) {
    console.error('Profile check error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = profileCheck; 