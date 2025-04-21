const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['Strength', 'Cardio', 'Flexibility', 'Mixed'],
    default: 'Mixed'
  },
  exercises: [
    {
      name: {
        type: String,
        required: true
      },
      sets: {
        type: Number
      },
      reps: {
        type: Number
      },
      weight: {
        type: Number
      },
      duration: {
        type: Number // in minutes
      },
      distance: {
        type: Number // in meters/km
      },
      notes: {
        type: String
      }
    }
  ],
  duration: {
    type: Number // in minutes
  },
  caloriesBurned: {
    type: Number
  },
  completed: {
    type: Boolean,
    default: false
  },
  scheduledFor: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Workout', WorkoutSchema);