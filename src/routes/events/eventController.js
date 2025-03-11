const { validationResult } = require('express-validator');
const Event = require('../../models/Event');
const User = require('../../models/User'); // Import the User model

exports.createEvent = async (req, res) => {
  // console.log("Incoming Event Data:", req.body);

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const eventData = {
      ...req.body,
      organizerId: req.user.userId,
    };

    const event = new Event(eventData);
    await event.save();

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Ensure the logged-in user is the creator
    if (event.organizerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    // Handle totalSeats adjustment
    if (req.body.totalSeats) {
      const seatsDifference = req.body.totalSeats - event.totalSeats;
      req.body.availableSeats = event.availableSeats + seatsDifference;
    }

    // Validate that availableSeats doesn't go below 0
    if (req.body.availableSeats < 0) {
      return res.status(400).json({ message: 'Available seats cannot be negative' });
    }

    // Update only the fields that are being modified
    Object.keys(req.body).forEach(key => {
      if (req.body[key]) {
        event[key] = req.body[key];
      }
    });

    await event.save();

    res.json({
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Ensure the logged-in user is the creator
    if (event.organizerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await event.remove();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const { category, expired } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    if (expired !== undefined) {
      query.isExpired = expired === 'true';
    }

    const events = await Event.find(query).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.changeUserRole = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, newRole } = req.body;

    // Check if the user making the request is an admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to change roles' });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's role
    user.role = newRole;
    await user.save();

    res.json({
      message: `User role updated successfully to ${newRole}`,
      user
    });
  } catch (error) {
    console.error('Change user role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
