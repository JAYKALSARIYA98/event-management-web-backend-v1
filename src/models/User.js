const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Student', 'Faculty', 'HOD', 'Principal', 'ISTE', 'IEEE', 'ETTC', 'Admin'], // Allowed roles
    default: 'Student' // Default role for new users
  },
  // Student profile fields
  phoneNumber: {
    type: String,
    trim: true
  },
  enrollmentNumber: {
    type: String,
    trim: true
  },
  birthdate: {
    type: Date
  },
  class: {
    type: String,
    trim: true
  },
  year: {
    type: Number
  },
  semester: {
    type: Number
  },
  hasCompletedProfile: {
    type: Boolean,
    default: false
  },
  // Events registered by the user
  registeredEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
 
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Remove sensitive information when converting to JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.isVerified;
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;