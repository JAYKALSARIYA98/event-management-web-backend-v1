const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only allow non-student roles to create/edit events
    if (user.role === 'Student') {
      return res.status(403).json({ message: 'Students are not allowed to manage events' });
    }
    
    req.user = decoded;
    req.userRole = user.role;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};