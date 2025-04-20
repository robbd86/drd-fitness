import React from 'react';
import { theme, commonStyles } from './theme';

export default function Achievements({ entries, workouts, nutrition, waterLogs, profileData }) {
  // Calculate user stats
  const calculateStats = () => {
    const stats = {
      daysLogged: 0,
      workoutCount: workouts.length,
      weightChange: 0,
      calorieAvg: 0,
      waterAvg: 0,
      longestStreak: 0
    };
    
    if (entries.length >= 2) {
      const firstEntry = entries[0];
      const lastEntry = entries[entries.length - 1];
      stats.weightChange = lastEntry.weight - firstEntry.weight;
      stats.daysLogged = entries.length;
    }
    
    if (nutrition.length > 0) {
      const totalCalories = nutrition.reduce((sum, entry) => sum + entry.calories, 0);
      stats.calorieAvg = Math.round(totalCalories / nutrition.length);
    }
    
    if (waterLogs.length > 0) {
      const totalWater = waterLogs.reduce((sum, entry) => sum + entry.amount, 0);
      stats.waterAvg = Math.round(totalWater / waterLogs.length);
    }
    
    // Find longest streak (consecutive days with activity)
    // ... (this would require dates to be in order and a more complex calculation)
    stats.longestStreak = 3; // Placeholder
    
    return stats;
  };
  
  const stats = calculateStats();
  
  // Achievement types
  const achievements = [
    {
      title: "First Workout",
      description: "Logged your first workout",
      unlocked: workouts.length > 0,
      icon: "🏋️"
    },
    {
      title: "Consistency King",
      description: "Logged activity for 7 consecutive days",
      unlocked: stats.longestStreak >= 7,
      icon: "👑"
    },
    {
      title: "Nutrition Tracker",
      description: "Tracked your nutrition for 5+ days",
      unlocked: nutrition.length >= 5,
      icon: "🥗"
    },
    {
      title: "Hydration Hero",
      description: "Met your water goal for 3+ days",
      unlocked: waterLogs.filter(log => log.amount >= 2000).length >= 3,
      icon: "💧"
    },
    {
      title: "Goal Crusher",
      description: "Reached your target weight",
      unlocked: entries.length > 0 && profileData.targetWeight && 
                (profileData.targetWeight > entries[0].weight ? 
                 entries[entries.length-1].weight >= profileData.targetWeight :
                 entries[entries.length-1].weight <= profileData.targetWeight),
      icon: "🏆"
    },
    {
      title: "Strength Builder",
      description: "Logged 10+ strength workouts",
      unlocked: workouts.length >= 10,
      icon: "💪"
    }
  ];
  
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);
  
  // Get appropriate message based on progress
  const getMotivationalMessage = () => {
    const unlockedCount = unlockedAchievements.length;
    const totalCount = achievements.length;
    
    if (unlockedCount === 0) return "Start your fitness journey by unlocking your first achievement!";
    if (unlockedCount < totalCount / 3) return "Great start! Keep going to unlock more achievements.";
    if (unlockedCount < totalCount * 2/3) return "You're making excellent progress!";
    if (unlockedCount < totalCount) return "Almost there! Just a few more achievements to unlock.";
    return "Incredible! You've unlocked all achievements. You're a fitness champion!";
  };

  const containerStyle = {
    ...commonStyles.card,
    marginBottom: theme.spacing.xl,
  };

  const headingStyle = {
    color: theme.colors.text.primary,
    fontSize: theme.typography.heading.h3,
    marginBottom: theme.spacing.md,
    position: "relative",
    paddingLeft: theme.spacing.md,
    display: "flex",
    alignItems: "center",
  };

  const headingAccentStyle = {
    width: "3px",
    height: "20px",
    backgroundColor: theme.colors.accent.primary,
    position: "absolute",
    left: "0",
    borderRadius: theme.borderRadius.small,
  };
  
  const statsContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  };
  
  const statBoxStyle = {
    backgroundColor: theme.colors.background.accent,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.small,
    textAlign: "center",
  };
  
  const statValueStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0 0 4px 0",
    color: theme.colors.accent.primary,
  };
  
  const statLabelStyle = {
    fontSize: "14px",
    margin: 0,
    color: theme.colors.text.secondary,
  };

  const messageBannerStyle = {
    backgroundColor: theme.colors.background.accent,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.small,
    marginBottom: theme.spacing.lg,
    textAlign: "center",
    color: theme.colors.text.primary,
    border: `1px solid ${theme.colors.accent.primary}`,
  };
  
  const achievementsContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  };
  
  const achievementCardStyle = (unlocked) => ({
    backgroundColor: unlocked ? theme.colors.background.secondary : theme.colors.background.accent,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.small,
    border: unlocked ? `1px solid ${theme.colors.accent.primary}` : `1px solid ${theme.colors.background.accent}`,
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.md,
  });
  
  const achievementIconStyle = (unlocked) => ({
    fontSize: "24px",
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.small,
    backgroundColor: unlocked ? theme.colors.accent.primary : theme.colors.background.secondary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
  });
  
  const achievementTitleStyle = (unlocked) => ({
    margin: "0 0 4px 0",
    fontSize: "16px",
    fontWeight: "bold",
    color: unlocked ? theme.colors.text.primary : theme.colors.text.secondary,
  });
  
  const achievementDescStyle = {
    margin: 0,
    fontSize: "14px",
    color: theme.colors.text.secondary,
  };
  
  return (
    <div style={containerStyle}>
      <div style={headingStyle}>
        <div style={headingAccentStyle}></div>
        <h3>Fitness Progress</h3>
      </div>
      
      <div style={statsContainerStyle}>
        <div style={statBoxStyle}>
          <p style={statValueStyle}>{stats.daysLogged}</p>
          <p style={statLabelStyle}>Days Tracked</p>
        </div>
        <div style={statBoxStyle}>
          <p style={statValueStyle}>{stats.workoutCount}</p>
          <p style={statLabelStyle}>Workouts</p>
        </div>
        <div style={statBoxStyle}>
          <p style={statValueStyle}>{stats.weightChange > 0 ? `+${stats.weightChange}` : stats.weightChange} kg</p>
          <p style={statLabelStyle}>Weight Change</p>
        </div>
        <div style={statBoxStyle}>
          <p style={statValueStyle}>{stats.calorieAvg}</p>
          <p style={statLabelStyle}>Avg. Calories</p>
        </div>
      </div>
      
      <div style={messageBannerStyle}>
        <p style={{ margin: 0 }}>{getMotivationalMessage()}</p>
      </div>
      
      <div>
        <div style={headingStyle}>
          <div style={headingAccentStyle}></div>
          <h3>Achievements ({unlockedAchievements.length}/{achievements.length})</h3>
        </div>
        
        <div style={achievementsContainerStyle}>
          {unlockedAchievements.map((achievement, index) => (
            <div key={index} style={achievementCardStyle(true)}>
              <div style={achievementIconStyle(true)}>{achievement.icon}</div>
              <div>
                <h4 style={achievementTitleStyle(true)}>{achievement.title}</h4>
                <p style={achievementDescStyle}>{achievement.description}</p>
              </div>
            </div>
          ))}
          
          {lockedAchievements.map((achievement, index) => (
            <div key={index} style={achievementCardStyle(false)}>
              <div style={achievementIconStyle(false)}>🔒</div>
              <div>
                <h4 style={achievementTitleStyle(false)}>{achievement.title}</h4>
                <p style={achievementDescStyle}>{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}