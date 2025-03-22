const User = require('../models/User');

const userAuth = async (req, res, next) => {
  try {
    // Get email from the token (already decoded by auth middleware)
    const userEmail = req.user.email;
    
    // Find user by email
    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach the full user object to the request
    req.user = user;
    next();
  } catch (error) {
    console.error('User auth middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = userAuth; 