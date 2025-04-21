const express = require('express');
const router = express.Router();
const { 
  createWorkout, 
  getUserWorkouts, 
  getWorkout, 
  updateWorkout, 
  deleteWorkout,
  getWorkoutStats
} = require('../controllers/workoutController');
const { protect } = require('../middleware/auth');

// All workout routes are protected
router.use(protect);

// Routes for workout stats
router.get('/stats', getWorkoutStats);

// CRUD operations for workouts
router.route('/')
  .post(createWorkout)
  .get(getUserWorkouts);

router.route('/:id')
  .get(getWorkout)
  .put(updateWorkout)
  .delete(deleteWorkout);

module.exports = router;