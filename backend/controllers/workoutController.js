const Workout = require('../models/Workout');

// @desc    Create new workout
// @route   POST /api/workouts
// @access  Private
exports.createWorkout = async (req, res) => {
  try {
    const { title, type, exercises, duration, calories, notes, date } = req.body;

    const workout = await Workout.create({
      user: req.user.id,
      title,
      type,
      exercises,
      duration,
      calories,
      notes,
      date: date || Date.now()
    });

    res.status(201).json({
      success: true,
      workout
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all workouts for user
// @route   GET /api/workouts
// @access  Private
exports.getUserWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id }).sort({ date: -1 });

    res.json({
      success: true,
      count: workouts.length,
      workouts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single workout
// @route   GET /api/workouts/:id
// @access  Private
exports.getWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }

    // Check if user owns the workout
    if (workout.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    res.json({
      success: true,
      workout
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update workout
// @route   PUT /api/workouts/:id
// @access  Private
exports.updateWorkout = async (req, res) => {
  try {
    const { title, type, exercises, duration, calories, notes, date } = req.body;

    let workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }

    // Check if user owns the workout
    if (workout.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    workout = await Workout.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      workout
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete workout
// @route   DELETE /api/workouts/:id
// @access  Private
exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }

    // Check if user owns the workout
    if (workout.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await workout.remove();

    res.json({
      success: true,
      message: 'Workout removed'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get workout statistics
// @route   GET /api/workouts/stats
// @access  Private
exports.getWorkoutStats = async (req, res) => {
  try {
    // Get start and end date from query or default to current month
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
    const startDate = req.query.startDate ? 
      new Date(req.query.startDate) : 
      new Date(endDate.getFullYear(), endDate.getMonth(), 1); // First day of current month

    // Aggregate stats
    const workouts = await Workout.find({
      user: req.user.id,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });

    // Calculate statistics
    const totalWorkouts = workouts.length;
    const totalDuration = workouts.reduce((sum, workout) => sum + workout.duration, 0);
    const totalCalories = workouts.reduce((sum, workout) => sum + workout.calories, 0);
    
    // Group by workout type
    const workoutTypes = {};
    workouts.forEach(workout => {
      if (!workoutTypes[workout.type]) {
        workoutTypes[workout.type] = 0;
      }
      workoutTypes[workout.type]++;
    });

    res.json({
      success: true,
      stats: {
        totalWorkouts,
        totalDuration,
        totalCalories,
        workoutTypes,
        period: {
          start: startDate,
          end: endDate
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};