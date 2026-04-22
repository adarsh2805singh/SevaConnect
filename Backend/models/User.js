// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    // Common fields
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      minlength: 2
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false // Don't return password by default
    },
    phone: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      enum: ['volunteer', 'ngo', 'admin'],
      required: true
    },

    // Volunteer-specific fields
    skills: {
      type: [String],
      default: []
    },
    availability: {
      type: String,
      enum: ['weekdays', 'weekends', 'flexible', 'available'],
      default: 'flexible'
    },
    appliedTasks: [
      {
        taskId: mongoose.Schema.Types.ObjectId,
        appliedAt: {
          type: Date,
          default: Date.now
        },
        status: {
          type: String,
          enum: ['applied', 'accepted', 'rejected', 'completed'],
          default: 'applied'
        }
      }
    ],
    bio: String,
    profileImage: String,

    // NGO-specific fields
    organizationName: String,
    organizationDescription: String,
    registrationNumber: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    website: String,
    socialLinks: {
      facebook: String,
      twitter: String,
      linkedin: String,
      instagram: String
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date,
    rejectionReason: String,
    postedTasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
      }
    ],
    logoImage: String,

    // General fields
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    collection: 'users'
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get user data without sensitive info
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Remove duplicate index - unique constraint on email field handles this
userSchema.index({ role: 1 });
userSchema.index({ isApproved: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
