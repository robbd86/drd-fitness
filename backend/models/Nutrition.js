const mongoose = require('mongoose');

const NutritionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  meals: [
    {
      name: {
        type: String,
        required: true,
        enum: ['breakfast', 'lunch', 'dinner', 'snack']
      },
      foods: [
        {
          name: {
            type: String,
            required: true
          },
          calories: {
            type: Number,
            required: true
          },
          protein: {
            type: Number,
            default: 0
          },
          carbs: {
            type: Number,
            default: 0
          },
          fat: {
            type: Number,
            default: 0
          },
          servingSize: {
            type: String
          },
          servingQty: {
            type: Number,
            default: 1
          }
        }
      ]
    }
  ],
  totalCalories: {
    type: Number,
    default: 0
  },
  totalProtein: {
    type: Number,
    default: 0
  },
  totalCarbs: {
    type: Number,
    default: 0
  },
  totalFat: {
    type: Number,
    default: 0
  },
  water: {
    type: Number,
    default: 0,
    comment: "Water intake in oz"
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Calculate totals before saving
NutritionSchema.pre('save', function(next) {
  // Initialize totals
  this.totalCalories = 0;
  this.totalProtein = 0;
  this.totalCarbs = 0;
  this.totalFat = 0;
  
  // Calculate totals from all meals and foods
  this.meals.forEach(meal => {
    meal.foods.forEach(food => {
      this.totalCalories += food.calories * food.servingQty;
      this.totalProtein += food.protein * food.servingQty;
      this.totalCarbs += food.carbs * food.servingQty;
      this.totalFat += food.fat * food.servingQty;
    });
  });
  
  next();
});

module.exports = mongoose.model('Nutrition', NutritionSchema);