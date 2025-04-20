import React, { useState, useEffect } from 'react';

export default function Achievements({ entries, workouts, nutrition, waterLogs, profileData }) {
  const [achievements, setAchievements] = useState([]);
  const [streaks, setStreaks] = useState({
    currentWorkoutStreak: 0,
    longestWorkoutStreak: 0,
    currentNutritionStreak: 0,
    longestNutritionStreak: 0,
    currentWaterStreak: 0,
    longestWaterStreak: 0,
  });

  // Calculate various achievements and streaks
  useEffect(() => {
    const newAchievements = [];
    
    // Weight progress achievements
    if (entries.length >= 1) {
      newAchievements.push({
        id: "first_weight_entry",
        name: "First Steps",
        description: "Logged your first weight entry",
        date: entries[0].date,
        icon: "🏆"
      });
    }
    
    if (entries.length >= 10) {
      newAchievements.push({
        id: "ten_weight_entries",
        name: "Consistency Champion",
        description: "Logged 10 weight entries",
        date: entries[9].date,
        icon: "📊"
      });
    }
    
    if (entries.length >= 2) {
      const firstWeight = entries[0].weight;
      const latestWeight = entries[entries.length - 1].weight;
      
      // Weight loss achievement
      if (latestWeight < firstWeight && profileData.targetWeight < firstWeight) {
        newAchievements.push({
          id: "weight_loss_progress",
          name: "On the Right Track",
          description: `Lost ${(firstWeight - latestWeight).toFixed(1)} kg towards your goal`,
          date: entries[entries.length - 1].date,
          icon: "⬇️"
        });
      }
      
      // Weight gain achievement (for those trying to gain weight)
      if (latestWeight > firstWeight && profileData.targetWeight > firstWeight) {
        newAchievements.push({
          id: "weight_gain_progress",
          name: "Gaining Ground",
          description: `Gained ${(latestWeight - firstWeight).toFixed(1)} kg towards your goal`,
          date: entries[entries.length - 1].date,
          icon: "⬆️"
        });
      }
      
      // Goal achievement
      const closeToTargetWeight = Math.abs(latestWeight - profileData.targetWeight) < 1;
      if (closeToTargetWeight) {
        newAchievements.push({
          id: "goal_weight_achieved",
          name: "Target Acquired",
          description: "Reached your target weight! 🎉",
          date: entries[entries.length - 1].date,
          icon: "🎯"
        });
      }
    }
    
    // Workout achievements
    if (workouts.length >= 1) {
      newAchievements.push({
        id: "first_workout",
        name: "First Workout",
        description: "Completed your first workout",
        date: workouts[0].date,
        icon: "💪"
      });
    }
    
    if (workouts.length >= 10) {
      newAchievements.push({
        id: "workout_warrior",
        name: "Workout Warrior",
        description: "Completed 10 workouts",
        date: workouts[9].date,
        icon: "🏋️"
      });
    }
    
    // Nutrition achievements
    if (nutrition.length >= 1) {
      newAchievements.push({
        id: "first_nutrition_log",
        name: "Nutrition Awareness",
        description: "Started tracking your nutrition",
        date: nutrition[0].date,
        icon: "🥗"
      });
    }
    
    if (nutrition.length >= 7) {
      newAchievements.push({
        id: "nutrition_streak",
        name: "Nutrition Streak",
        description: "Tracked your nutrition for 7 days",
        date: nutrition[6].date,
        icon: "📝"
      });
    }
    
    // Check if user hit their protein goal multiple days in a row
    const proteinDays = nutrition.filter(n => n.protein >= profileData.targetProtein).length;
    if (proteinDays >= 5) {
      newAchievements.push({
        id: "protein_master",
        name: "Protein Master",
        description: `Hit your protein goal ${proteinDays} times`,
        date: new Date().toISOString().split('T')[0],
        icon: "🥩"
      });
    }
    
    // Water tracking achievements
    if (waterLogs.length >= 1) {
      newAchievements.push({
        id: "hydration_initiate",
        name: "Hydration Initiate",
        description: "Started tracking your water intake",
        date: waterLogs[0].date,
        icon: "💧"
      });
    }
    
    // Calculate streaks
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    // Workout streaks
    const workoutDates = [...new Set(workouts.map(w => w.date))].sort();
    let currentWorkoutStreak = 0;
    let longestWorkoutStreak = 0;
    let tempStreak = 0;
    
    // Check for latest streak
    if (workoutDates.includes(today) || workoutDates.includes(yesterday)) {
      currentWorkoutStreak = 1;
      for (let i = workoutDates.length - 1; i > 0; i--) {
        const currentDate = new Date(workoutDates[i]);
        const prevDate = new Date(workoutDates[i-1]);
        const diffDays = Math.floor((currentDate - prevDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          currentWorkoutStreak++;
        } else {
          break;
        }
      }
    }
    
    // Find longest streak
    for (let i = 0; i < workoutDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const currentDate = new Date(workoutDates[i]);
        const prevDate = new Date(workoutDates[i-1]);
        const diffDays = Math.floor((currentDate - prevDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      
      longestWorkoutStreak = Math.max(longestWorkoutStreak, tempStreak);
    }
    
    // Similar logic for nutrition and water streaks
    const nutritionDates = [...new Set(nutrition.map(n => n.date))].sort();
    let currentNutritionStreak = 0;
    let longestNutritionStreak = 0;
    
    // Check for latest streak
    if (nutritionDates.includes(today) || nutritionDates.includes(yesterday)) {
      currentNutritionStreak = 1;
      for (let i = nutritionDates.length - 1; i > 0; i--) {
        const currentDate = new Date(nutritionDates[i]);
        const prevDate = new Date(nutritionDates[i-1]);
        const diffDays = Math.floor((currentDate - prevDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          currentNutritionStreak++;
        } else {
          break;
        }
      }
    }
    
    // Find longest streak
    tempStreak = 0;
    for (let i = 0; i < nutritionDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const currentDate = new Date(nutritionDates[i]);
        const prevDate = new Date(nutritionDates[i-1]);
        const diffDays = Math.floor((currentDate - prevDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      
      longestNutritionStreak = Math.max(longestNutritionStreak, tempStreak);
    }

    // Water streaks calculation
    const waterDates = [...new Set(waterLogs.map(w => w.date))].sort();
    let currentWaterStreak = 0;
    let longestWaterStreak = 0;
    
    // Check for latest streak
    if (waterDates.includes(today) || waterDates.includes(yesterday)) {
      currentWaterStreak = 1;
      for (let i = waterDates.length - 1; i > 0; i--) {
        const currentDate = new Date(waterDates[i]);
        const prevDate = new Date(waterDates[i-1]);
        const diffDays = Math.floor((currentDate - prevDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          currentWaterStreak++;
        } else {
          break;
        }
      }
    }
    
    // Find longest streak
    tempStreak = 0;
    for (let i = 0; i < waterDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const currentDate = new Date(waterDates[i]);
        const prevDate = new Date(waterDates[i-1]);
        const diffDays = Math.floor((currentDate - prevDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      
      longestWaterStreak = Math.max(longestWaterStreak, tempStreak);
    }
    
    // Add streak achievements
    if (currentWorkoutStreak >= 3) {
      newAchievements.push({
        id: "workout_streak_3",
        name: "Workout Streak",
        description: `${currentWorkoutStreak} day workout streak!`,
        date: today,
        icon: "🔥"
      });
    }
    
    if (longestWorkoutStreak >= 7) {
      newAchievements.push({
        id: "workout_streak_7",
        name: "Weekly Warrior",
        description: `7-day workout streak achieved!`,
        date: today,
        icon: "🔥🔥"
      });
    }
    
    if (currentNutritionStreak >= 7) {
      newAchievements.push({
        id: "nutrition_streak_7",
        name: "Nutrition Expert",
        description: `7-day nutrition tracking streak!`,
        date: today,
        icon: "🍎"
      });
    }

    // Update achievements and streaks
    setAchievements(newAchievements);
    setStreaks({
      currentWorkoutStreak,
      longestWorkoutStreak,
      currentNutritionStreak,
      longestNutritionStreak,
      currentWaterStreak,
      longestWaterStreak
    });
  }, [entries, workouts, nutrition, waterLogs, profileData]);

  return (
    <div style={{ marginBottom: "30px" }}>
      <h2>Achievements & Streaks</h2>
      
      <div style={{ display: "flex", gap: "15px", overflowX: "auto", marginBottom: "20px", padding: "10px" }}>
        <div style={{ 
          padding: "15px", 
          minWidth: "120px", 
          borderRadius: "8px", 
          backgroundColor: "#e3f2fd", 
          textAlign: "center",
          border: "1px solid #bbdefb"
        }}>
          <div style={{ fontSize: "24px", marginBottom: "5px" }}>🏋️</div>
          <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "5px" }}>{streaks.currentWorkoutStreak}</div>
          <div style={{ fontSize: "14px" }}>Workout streak</div>
          <div style={{ fontSize: "12px", marginTop: "5px", color: "#666" }}>Best: {streaks.longestWorkoutStreak}</div>
        </div>
        
        <div style={{ 
          padding: "15px", 
          minWidth: "120px", 
          borderRadius: "8px", 
          backgroundColor: "#f1f8e9", 
          textAlign: "center",
          border: "1px solid #dcedc8"
        }}>
          <div style={{ fontSize: "24px", marginBottom: "5px" }}>🥗</div>
          <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "5px" }}>{streaks.currentNutritionStreak}</div>
          <div style={{ fontSize: "14px" }}>Nutrition streak</div>
          <div style={{ fontSize: "12px", marginTop: "5px", color: "#666" }}>Best: {streaks.longestNutritionStreak}</div>
        </div>
        
        <div style={{ 
          padding: "15px", 
          minWidth: "120px", 
          borderRadius: "8px", 
          backgroundColor: "#e1f5fe", 
          textAlign: "center",
          border: "1px solid #b3e5fc"
        }}>
          <div style={{ fontSize: "24px", marginBottom: "5px" }}>💧</div>
          <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "5px" }}>{streaks.currentWaterStreak}</div>
          <div style={{ fontSize: "14px" }}>Water streak</div>
          <div style={{ fontSize: "12px", marginTop: "5px", color: "#666" }}>Best: {streaks.longestWaterStreak}</div>
        </div>
      </div>
      
      <h3>Your Achievements</h3>
      {achievements.length > 0 ? (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", 
          gap: "15px" 
        }}>
          {achievements.map((achievement) => (
            <div 
              key={achievement.id}
              style={{ 
                border: "1px solid #ddd", 
                borderRadius: "8px", 
                padding: "15px",
                backgroundColor: "#f9f9f9",
                display: "flex",
                alignItems: "center"
              }}
            >
              <div style={{ fontSize: "36px", marginRight: "15px" }}>{achievement.icon}</div>
              <div>
                <h4 style={{ margin: "0 0 5px 0" }}>{achievement.name}</h4>
                <p style={{ margin: "0 0 5px 0" }}>{achievement.description}</p>
                <small style={{ color: "#666" }}>Achieved on {achievement.date}</small>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No achievements yet. Keep tracking your progress to unlock achievements!</p>
      )}
    </div>
  );
}