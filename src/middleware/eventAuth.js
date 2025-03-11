const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
	try {
		const token = req.header('Authorization')?.replace('Bearer ', '');

		if (!token) {
			// console.log("No token received");
			return res.status(401).json({ message: 'No token, authorization denied' });
		}

		// console.log("Received Token:", token);

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		// console.log("Decoded Token:", decoded);

		const user = await User.findById(decoded.userId);

		if (!user) {
			// console.log("User not found in database");
			return res.status(404).json({ message: 'User not found' });
		}

		// console.log("User Found:", user);

		if (user.role === 'Student') {
			// console.log("Access denied: User is a student");
			return res.status(403).json({ message: 'Students are not allowed to manage events' });
		}

		req.user = { userId: decoded.userId, role: user.role };
		req.userRole = user.role;

		// console.log("Request User Set:", req.user);
		next();
	} catch (error) {
		// console.error("Auth Middleware Error:", error);
		res.status(401).json({ message: 'Token is not valid' });
	}
};
