// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
      minlength: 5,
      maxlength: 100
    },
    description: {
      type: String,
      required: [true, 'Please provide a task description'],
      minlength: 20
    },
    category: {
      type: String,
      enum: ['education', 'healthcare', 'environment', 'community', 'emergency', 'other'],
      required: true
    },
    location: {
      address: String,
      city: {
        type: String,
        required: true
      },
      state: String,
      zipCode: String
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    skillsRequired: [String],
    volunteerCount: {
      type: Number,
      default: 0,
      min: 1
    },
    duration: {
      type: String,
      enum: ['one-time', 'weekly', 'monthly', 'ongoing'],
      default: 'one-time'
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: Date,
    applicants: [
      {
        volunteerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
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
    acceptedVolunteers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    status: {
      type: String,
      enum: ['open', 'in-progress', 'completed', 'cancelled'],
      default: 'open'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    image: String,
    views: {
      type: Number,
      default: 0
    },
    isUrgent: {
      type: Boolean,
      default: false
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
    collection: 'tasks'
  }
);

// Index for common queries
taskSchema.index({ postedBy: 1, status: 1 });
taskSchema.index({ category: 1, status: 1 });
taskSchema.index({ city: 1, status: 1 });
taskSchema.index({ startDate: 1 });
taskSchema.index({ status: 1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
