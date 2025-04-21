import React, { useState, useEffect } from 'react';
import { theme, commonStyles } from './theme';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function UserProfile({ profile, weightEntries, onUpdateProfile }) {
  const [editing, setEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [animateIn, setAnimateIn] = useState(false);

  // Add animation effect on component mount
  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: name === 'age' || name === 'height' || name === 'currentWeight' || name === 'targetWeight' 
        ? parseInt(value, 10) 
        : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the onUpdateProfile prop to update the profile in parent component
    if (onUpdateProfile) {
      onUpdateProfile(editedProfile);
    }
    setEditing(false);
  };

  // Calculate BMI
  const calculateBMI = (weight, height) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const bmi = calculateBMI(profile.currentWeight, profile.height);

  // Define BMI category
  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: theme.colors.warning };
    if (bmi < 25) return { category: 'Normal', color: theme.colors.success };
    if (bmi < 30) return { category: 'Overweight', color: theme.colors.warning };
    return { category: 'Obese', color: theme.colors.error };
  };

  const bmiInfo = getBMICategory(bmi);

  // Chart data for weight progress
  const chartData = {
    labels: weightEntries.map(entry => entry.date),
    datasets: [
      {
        label: 'Weight (kg)',
        data: weightEntries.map(entry => entry.weight),
        fill: false,
        backgroundColor: theme.colors.accent.primary,
        borderColor: theme.colors.accent.primary,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: theme.colors.text.primary
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: theme.colors.text.secondary
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: theme.colors.text.secondary
        },
        beginAtZero: false
      }
    }
  };

  // Calculate daily calorie needs
  const calculateDailyCalories = (weight, height, age, activity, goal) => {
    // Basic BMR using Mifflin-St Jeor Equation
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5; // For men, -161 for women
    
    // Activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    
    const activityMultiplier = activityMultipliers[activity] || 1.2;
    
    // Daily calories with activity
    let calories = bmr * activityMultiplier;
    
    // Adjust for goal
    const goalAdjustments = {
      weight_loss: -500, // Deficit for weight loss
      maintenance: 0,
      muscle_gain: 300 // Surplus for muscle gain
    };
    
    calories += goalAdjustments[goal] || 0;
    
    return Math.round(calories);
  };
  
  const dailyCalories = calculateDailyCalories(
    profile.currentWeight, 
    profile.height, 
    profile.age, 
    profile.activity, 
    profile.goal
  );

  // Component styles
  const containerStyle = {
    ...commonStyles.card,
    marginBottom: theme.spacing.xl,
    transition: 'all 0.3s ease-in-out',
    opacity: animateIn ? 1 : 0,
    transform: animateIn ? 'translateY(0)' : 'translateY(20px)',
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
  
  const sectionsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: theme.spacing.lg,
  };
  
  const sectionStyle = {
    backgroundColor: theme.colors.background.accent,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
    }
  };
  
  const statBoxesStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  };
  
  const statBoxStyle = (accent = false) => ({
    backgroundColor: accent ? theme.colors.accent.primary : theme.colors.background.secondary,
    color: accent ? theme.colors.background.primary : theme.colors.text.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.small,
    textAlign: "center",
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    cursor: 'default',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    }
  });
  
  const statNumberStyle = {
    fontSize: "1.75rem",
    fontWeight: "bold",
    margin: "0 0 4px 0",
  };
  
  const statLabelStyle = {
    fontSize: "0.875rem",
    margin: 0,
    opacity: 0.8,
  };
  
  const formGroupStyle = {
    marginBottom: theme.spacing.md,
  };
  
  const labelStyle = {
    display: "block",
    marginBottom: theme.spacing.xs,
    color: theme.colors.text.secondary,
    fontWeight: 500,
  };
  
  const inputStyle = {
    width: "100%",
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.small,
    border: `1px solid ${theme.colors.background.accent}`,
    backgroundColor: theme.colors.background.secondary,
    color: theme.colors.text.primary,
    transition: 'border-color 0.2s ease',
    '&:focus': {
      borderColor: theme.colors.accent.primary,
      outline: 'none',
    }
  };
  
  const selectStyle = {
    ...inputStyle,
    height: "40px",
  };
  
  const buttonStyle = {
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    backgroundColor: theme.colors.accent.primary,
    color: theme.colors.background.primary,
    border: "none",
    borderRadius: theme.borderRadius.small,
    cursor: "pointer",
    fontWeight: 500,
    marginTop: theme.spacing.sm,
    transition: 'background-color 0.2s ease, transform 0.1s ease',
    '&:hover': {
      backgroundColor: theme.colors.accent.secondary,
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(1px)',
    }
  };

  const chartContainerStyle = {
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    marginTop: theme.spacing.md,
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const progressIndicatorStyle = {
    position: 'relative',
    height: '8px',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.small,
    marginTop: theme.spacing.md,
    overflow: 'hidden',
  };

  const progressBarStyle = {
    position: 'absolute',
    height: '100%',
    backgroundColor: calculateProgressColor(),
    width: `${calculateProgressPercentage()}%`,
    borderRadius: theme.borderRadius.small,
    transition: 'width 0.5s ease-in-out',
  };

  // Calculate progress percentage from current to target weight
  function calculateProgressPercentage() {
    const { currentWeight, targetWeight } = profile;
    if (currentWeight === targetWeight) return 100;
    
    const startWeight = weightEntries.length > 1 ? weightEntries[0].weight : currentWeight;
    const totalChange = Math.abs(targetWeight - startWeight);
    const achievedChange = Math.abs(currentWeight - startWeight);
    
    const percentage = (achievedChange / totalChange) * 100;
    return Math.min(Math.max(percentage, 0), 100); // Keep between 0 and 100
  }

  // Calculate color based on progress
  function calculateProgressColor() {
    const progress = calculateProgressPercentage();
    if (progress < 30) return theme.colors.warning;
    if (progress < 70) return theme.colors.accent.primary;
    return theme.colors.success;
  }
  
  return (
    <div style={containerStyle}>
      <div style={headingStyle}>
        <div style={headingAccentStyle}></div>
        <h3>User Profile</h3>
      </div>
      
      <div style={sectionsGridStyle}>
        <div style={sectionStyle}>
          {!editing ? (
            <>
              <h4 style={{ color: theme.colors.text.primary, marginTop: 0 }}>Personal Information</h4>
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Age:</strong> {profile.age} years</p>
              <p><strong>Height:</strong> {profile.height} cm</p>
              <p><strong>Current Weight:</strong> {profile.currentWeight} kg</p>
              <p><strong>Target Weight:</strong> {profile.targetWeight} kg</p>
              <p><strong>Activity Level:</strong> {profile.activity.charAt(0).toUpperCase() + profile.activity.slice(1)}</p>
              <p><strong>Goal:</strong> {profile.goal === 'weight_loss' ? 'Weight Loss' : 
                                    profile.goal === 'maintenance' ? 'Maintenance' : 
                                    'Muscle Gain'}</p>
              <button 
                onClick={() => setEditing(true)}
                style={buttonStyle}
              >
                Edit Profile
              </button>
            </>
          ) : (
            <>
              <h4 style={{ color: theme.colors.text.primary, marginTop: 0 }}>Edit Profile</h4>
              <form onSubmit={handleSubmit}>
                <div style={formGroupStyle}>
                  <label htmlFor="name" style={labelStyle}>Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editedProfile.name}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </div>
                <div style={formGroupStyle}>
                  <label htmlFor="age" style={labelStyle}>Age</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={editedProfile.age}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </div>
                <div style={formGroupStyle}>
                  <label htmlFor="height" style={labelStyle}>Height (cm)</label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={editedProfile.height}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </div>
                <div style={formGroupStyle}>
                  <label htmlFor="currentWeight" style={labelStyle}>Current Weight (kg)</label>
                  <input
                    type="number"
                    id="currentWeight"
                    name="currentWeight"
                    value={editedProfile.currentWeight}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </div>
                <div style={formGroupStyle}>
                  <label htmlFor="targetWeight" style={labelStyle}>Target Weight (kg)</label>
                  <input
                    type="number"
                    id="targetWeight"
                    name="targetWeight"
                    value={editedProfile.targetWeight}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </div>
                <div style={formGroupStyle}>
                  <label htmlFor="activity" style={labelStyle}>Activity Level</label>
                  <select
                    id="activity"
                    name="activity"
                    value={editedProfile.activity}
                    onChange={handleInputChange}
                    style={selectStyle}
                  >
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Light</option>
                    <option value="moderate">Moderate</option>
                    <option value="active">Active</option>
                    <option value="very_active">Very Active</option>
                  </select>
                </div>
                <div style={formGroupStyle}>
                  <label htmlFor="goal" style={labelStyle}>Goal</label>
                  <select
                    id="goal"
                    name="goal"
                    value={editedProfile.goal}
                    onChange={handleInputChange}
                    style={selectStyle}
                  >
                    <option value="weight_loss">Weight Loss</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="muscle_gain">Muscle Gain</option>
                  </select>
                </div>
                <div style={{ display: "flex", gap: theme.spacing.md }}>
                  <button type="submit" style={buttonStyle}>Save</button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setEditing(false);
                      setEditedProfile({...profile});
                    }}
                    style={{
                      ...buttonStyle,
                      backgroundColor: "transparent",
                      color: theme.colors.text.primary,
                      border: `1px solid ${theme.colors.background.accent}`
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
        
        <div style={sectionStyle}>
          <h4 style={{ color: theme.colors.text.primary, marginTop: 0 }}>Health Metrics</h4>
          
          <div style={statBoxesStyle}>
            <div style={statBoxStyle(bmiInfo.category === 'Normal')}>
              <p style={statNumberStyle}>{bmi}</p>
              <p style={statLabelStyle}>BMI</p>
            </div>
            <div style={{
              ...statBoxStyle(),
              backgroundColor: bmiInfo.color,
              color: theme.colors.background.primary
            }}>
              <p style={statNumberStyle}>{bmiInfo.category}</p>
              <p style={statLabelStyle}>Category</p>
            </div>
            <div style={statBoxStyle(true)}>
              <p style={statNumberStyle}>{dailyCalories}</p>
              <p style={statLabelStyle}>Calories/day</p>
            </div>
          </div>
          
          <h4 style={{ color: theme.colors.text.primary }}>Weight Progress</h4>
          
          <div style={progressIndicatorStyle}>
            <div style={progressBarStyle}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: theme.colors.text.secondary }}>Start: {weightEntries.length > 0 ? weightEntries[0].weight : profile.currentWeight} kg</span>
            <span style={{ fontSize: '0.75rem', color: theme.colors.text.secondary }}>Target: {profile.targetWeight} kg</span>
          </div>
          
          <div style={chartContainerStyle}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}