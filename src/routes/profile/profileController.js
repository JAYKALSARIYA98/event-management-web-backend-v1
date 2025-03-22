const { validationResult } = require('express-validator');
const User = require('../../models/User');
const Event = require('../../models/Event');

// Create or update student profile
exports.createProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log('req.user in createProfile:', req.user);
    
    // Use userId instead of email for lookup
    const userId = req.user.userId;
    console.log('userId from token:', userId);
    
    const user = await User.findById(userId);
    console.log('Found user:', user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is a student
    if (user.role !== 'Student') {
      return res.status(403).json({ message: 'Only students can create profiles' });
    }

    // Check if profile already exists
    if (user.hasCompletedProfile) {
      return res.status(400).json({ message: 'Profile already exists. Use update profile instead.' });
    }

    const { phoneNumber, enrollmentNumber, birthdate, class: className, year, semester } = req.body;

    // Update user with profile information
    user.phoneNumber = phoneNumber;
    user.enrollmentNumber = enrollmentNumber;
    user.birthdate = new Date(birthdate);
    user.class = className;
    user.year = year;
    user.semester = semester;
    user.hasCompletedProfile = true;
    user.updatedAt = Date.now();

    await user.save();

    return res.status(201).json({
      message: 'Profile created successfully',
      profile: {
        phoneNumber: user.phoneNumber,
        enrollmentNumber: user.enrollmentNumber,
        birthdate: user.birthdate,
        class: user.class,
        year: user.year,
        semester: user.semester
      }
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is a student
    if (user.role !== 'Student') {
      return res.status(403).json({ message: 'Only students have profiles' });
    }

    // Check if profile exists
    if (!user.hasCompletedProfile) {
      return res.status(404).json({ message: 'Profile not found. Please create a profile first.' });
    }

    return res.status(200).json({
      profile: {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        enrollmentNumber: user.enrollmentNumber,
        birthdate: user.birthdate,
        class: user.class,
        year: user.year,
        semester: user.semester,
        registeredEvents: user.registeredEvents
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is a student
    if (user.role !== 'Student') {
      return res.status(403).json({ message: 'Only students can update profiles' });
    }

    // Check if profile exists
    if (!user.hasCompletedProfile) {
      return res.status(404).json({ message: 'Profile not found. Please create a profile first.' });
    }

    const { phoneNumber, enrollmentNumber, birthdate, class: className, year, semester } = req.body;

    // Update user with new profile information
    user.phoneNumber = phoneNumber;
    user.enrollmentNumber = enrollmentNumber;
    user.birthdate = new Date(birthdate);
    user.class = className;
    user.year = year;
    user.semester = semester;
    user.updatedAt = Date.now();

    await user.save();

    return res.status(200).json({
      message: 'Profile updated successfully',
      profile: {
        phoneNumber: user.phoneNumber,
        enrollmentNumber: user.enrollmentNumber,
        birthdate: user.birthdate,
        class: user.class,
        year: user.year,
        semester: user.semester
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get user's registered events
exports.getUserEvents = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is a student
    if (user.role !== 'Student') {
      return res.status(403).json({ message: 'Only students can have registered events' });
    }

    // Get events registered by the user with detailed information
    const registeredEvents = await Event.find({
      _id: { $in: user.registeredEvents }
    }).select('name description date time venue organizedBy category totalSeats availableSeats registrationDeadline contactEmail contactPhone');

    // Format the response with capacity information
    const formattedEvents = registeredEvents.map(event => {
      return {
        id: event._id,
        name: event.name,
        description: event.description,
        date: event.date,
        time: event.time,
        venue: event.venue,
        organizedBy: event.organizedBy,
        category: event.category,
        capacity: {
          total: event.totalSeats,
          available: event.availableSeats,
          filled: event.totalSeats - event.availableSeats,
          percentageFilled: Math.round(((event.totalSeats - event.availableSeats) / event.totalSeats) * 100)
        },
        registrationDeadline: event.registrationDeadline,
        contactEmail: event.contactEmail,
        contactPhone: event.contactPhone
      };
    });

    return res.status(200).json({
      totalRegisteredEvents: formattedEvents.length,
      registeredEvents: formattedEvents
    });
  } catch (error) {
    console.error('Error fetching user registered events:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};