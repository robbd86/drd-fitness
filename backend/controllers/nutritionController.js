const Nutrition = require('../models/Nutrition');

// @desc    Create new nutrition entry
// @route   POST /api/nutrition
// @access  Private
exports.createNutrition = async (req, res) => {
  try {
    const { date, meals, water, notes } = req.body;

    const nutrition = await Nutrition.create({
      user: req.user.id,
      date: date || Date.now(),
      meals,
      water,
      notes
    });

    res.status(201).json({
      success: true,
      nutrition
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all nutrition entries for user
// @route   GET /api/nutrition
// @access  Private
exports.getNutritionEntries = async (req, res) => {
  try {
    // Parse query parameters for filtering
    const { startDate, endDate } = req.query;
    const query = { user: req.user.id };
    
    // Add date range filtering if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const entries = await Nutrition.find(query).sort({ date: -1 });

    res.json({
      success: true,
      count: entries.length,
      entries
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single nutrition entry
// @route   GET /api/nutrition/:id
// @access  Private
exports.getNutritionEntry = async (req, res) => {
  try {
    const entry = await Nutrition.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Nutrition entry not found' });
    }

    // Check if user owns the entry
    if (entry.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    res.json({
      success: true,
      entry
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update nutrition entry
// @route   PUT /api/nutrition/:id
// @access  Private
exports.updateNutritionEntry = async (req, res) => {
  try {
    const { date, meals, water, notes } = req.body;
    
    let entry = await Nutrition.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Nutrition entry not found' });
    }

    // Check if user owns the entry
    if (entry.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    // Update fields
    if (date) entry.date = date;
    if (meals) entry.meals = meals;
    if (water !== undefined) entry.water = water;
    if (notes !== undefined) entry.notes = notes;

    await entry.save();

    res.json({
      success: true,
      entry
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete nutrition entry
// @route   DELETE /api/nutrition/:id
// @access  Private
exports.deleteNutritionEntry = async (req, res) => {
  try {
    const entry = await Nutrition.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Nutrition entry not found' });
    }

    // Check if user owns the entry
    if (entry.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await entry.deleteOne();

    res.json({
      success: true,
      message: 'Nutrition entry removed'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get nutrition stats for a time period
// @route   GET /api/nutrition/stats
// @access  Private
exports.getNutritionStats = async (req, res) => {
  try {
    const { startDate, endDate, period = 'day' } = req.query;
    const query = { user: req.user.id };
    
    // Add date range filtering if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    let entries = await Nutrition.find(query);
    
    // Calculate average values
    let stats = {
      totalEntries: entries.length,
      averageCalories: 0,
      averageProtein: 0,
      averageCarbs: 0,
      averageFat: 0,
      averageWater: 0
    };
    
    if (entries.length > 0) {
      const totals = entries.reduce((acc, entry) => {
        acc.calories += entry.totalCalories || 0;
        acc.protein += entry.totalProtein || 0;
        acc.carbs += entry.totalCarbs || 0;
        acc.fat += entry.totalFat || 0;
        acc.water += entry.water || 0;
        return acc;
      }, { calories: 0, protein: 0, carbs: 0, fat: 0, water: 0 });
      
      stats.averageCalories = totals.calories / entries.length;
      stats.averageProtein = totals.protein / entries.length;
      stats.averageCarbs = totals.carbs / entries.length;
      stats.averageFat = totals.fat / entries.length;
      stats.averageWater = totals.water / entries.length;
    }

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};