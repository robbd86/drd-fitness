import React, { useState, useEffect, useRef } from 'react';
import { theme, commonStyles } from './theme';

export function ExerciseLibrary({ onSelectExercise }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [animatedItem, setAnimatedItem] = useState(null);

  // Sample exercise library with categories
  const exercises = [
    { 
      name: "Barbell Squat", 
      category: "Legs", 
      description: "Compound exercise that targets quadriceps, hamstrings, and glutes.",
      muscles: ["Quadriceps", "Hamstrings", "Glutes"],
      difficulty: "Intermediate" 
    },
    { 
      name: "Bench Press", 
      category: "Chest", 
      description: "Compound movement that primarily works the pectorals, deltoids, and triceps.",
      muscles: ["Chest", "Shoulders", "Triceps"],
      difficulty: "Intermediate" 
    },
    { 
      name: "Deadlift", 
      category: "Back", 
      description: "Full-body compound exercise focusing on posterior chain development.",
      muscles: ["Back", "Glutes", "Hamstrings"],
      difficulty: "Advanced" 
    },
    { 
      name: "Pull-up", 
      category: "Back", 
      description: "Upper body compound movement utilizing bodyweight.",
      muscles: ["Lats", "Biceps", "Forearms"],
      difficulty: "Intermediate" 
    },
    { 
      name: "Overhead Press", 
      category: "Shoulders", 
      description: "Compound exercise targeting the deltoids and upper body.",
      muscles: ["Shoulders", "Triceps", "Upper Chest"],
      difficulty: "Intermediate" 
    },
    { 
      name: "Barbell Row", 
      category: "Back", 
      description: "Compound pulling exercise for back development.",
      muscles: ["Upper Back", "Lats", "Biceps"],
      difficulty: "Intermediate" 
    },
    { 
      name: "Dumbbell Curl", 
      category: "Arms", 
      description: "Isolation exercise for biceps development.",
      muscles: ["Biceps", "Forearms"],
      difficulty: "Beginner" 
    },
    { 
      name: "Tricep Pushdown", 
      category: "Arms", 
      description: "Isolation exercise for triceps development.",
      muscles: ["Triceps"],
      difficulty: "Beginner" 
    },
    { 
      name: "Leg Press", 
      category: "Legs", 
      description: "Machine compound exercise for lower body development.",
      muscles: ["Quadriceps", "Hamstrings", "Glutes"],
      difficulty: "Beginner" 
    },
    { 
      name: "Lateral Raise", 
      category: "Shoulders", 
      description: "Isolation exercise targeting the lateral deltoids.",
      muscles: ["Side Deltoids"],
      difficulty: "Beginner" 
    },
  ];
  
  // Get unique categories
  const categories = ["All", ...new Set(exercises.map(ex => ex.category))];
  
  // Filter exercises based on search and category
  const filteredExercises = exercises.filter(ex => {
    return (
      (selectedCategory === "All" || ex.category === selectedCategory) &&
      ex.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const containerStyle = {
    backgroundColor: theme.colors.background.accent,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    boxShadow: theme.shadows.medium,
    transition: theme.transitions.medium,
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

  const searchStyle = {
    width: "100%",
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.small,
    border: theme.components.input.border,
    backgroundColor: theme.components.input.background,
    color: theme.components.input.color,
    transition: theme.transitions.fast,
    outline: 'none',
    '&:focus': {
      borderColor: theme.colors.accent.primary,
      boxShadow: `0 0 0 2px ${theme.colors.accent.primaryTransparent}`,
    }
  };

  const categoryContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  };

  const categoryButtonStyle = (isSelected) => ({
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.small,
    backgroundColor: isSelected ? theme.colors.accent.primary : "transparent",
    color: isSelected ? theme.colors.background.primary : theme.colors.accent.primary,
    border: `1px solid ${theme.colors.accent.primary}`,
    cursor: "pointer",
    transition: theme.transitions.fast,
    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
  });

  const exerciseCardStyle = (isHovered, isAnimated) => ({
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.small,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    border: `1px solid ${isHovered || isAnimated ? theme.colors.accent.primary : theme.colors.background.accent}`,
    cursor: "pointer",
    transition: theme.transitions.fast,
    position: "relative",
    overflow: "hidden",
    transform: isHovered || isAnimated ? "translateY(-2px)" : "translateY(0)",
    boxShadow: isHovered || isAnimated ? theme.shadows.medium : theme.shadows.small,
    opacity: isAnimated ? '0.9' : '1',
  });

  const exerciseNameStyle = {
    color: theme.colors.text.primary,
    margin: "0 0 5px 0",
    fontWeight: 600,
  };

  const categoryBadgeStyle = {
    display: "inline-block",
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    backgroundColor: theme.colors.accent.primary,
    color: theme.colors.background.primary,
    borderRadius: theme.borderRadius.small,
    fontSize: "12px",
    marginRight: theme.spacing.sm,
  };

  const difficultyBadgeStyle = (difficulty) => {
    let bgColor;
    switch(difficulty) {
      case "Beginner":
        bgColor = theme.colors.success;
        break;
      case "Intermediate":
        bgColor = theme.colors.warning;
        break;
      case "Advanced":
        bgColor = theme.colors.error;
        break;
      default:
        bgColor = theme.colors.accent.primary;
    }
    
    return {
      display: "inline-block",
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      backgroundColor: bgColor,
      color: theme.colors.background.primary,
      borderRadius: theme.borderRadius.small,
      fontSize: "12px",
    };
  };

  const muscleTagStyle = {
    display: "inline-block",
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    backgroundColor: theme.colors.background.accent,
    color: theme.colors.text.secondary,
    borderRadius: theme.borderRadius.small,
    fontSize: "12px",
    margin: "0 5px 5px 0",
  };

  const descriptionStyle = {
    color: theme.colors.text.secondary,
    fontSize: "14px",
    marginTop: theme.spacing.sm,
    marginBottom: 0,
  };

  const selectButtonStyle = {
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    backgroundColor: theme.colors.accent.primary,
    color: theme.colors.background.primary,
    border: "none",
    borderRadius: theme.borderRadius.small,
    cursor: "pointer",
    marginTop: theme.spacing.sm,
    fontSize: "14px",
    transition: theme.transitions.fast,
    '&:focus': {
      outline: `2px solid ${theme.colors.accent.secondary}`,
      outlineOffset: '2px'
    }
  };

  const handleExerciseSelection = (exercise) => {
    setAnimatedItem(exercise.name);
    setTimeout(() => {
      onSelectExercise(exercise.name);
      setAnimatedItem(null);
    }, 300);
  };

  return (
    <div style={containerStyle}>
      <div style={headingStyle}>
        <div style={headingAccentStyle}></div>
        <h3>Exercise Library</h3>
      </div>
      
      <input 
        type="text"
        placeholder="Search exercises..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={searchStyle}
        aria-label="Search exercises"
      />
      
      <div style={categoryContainerStyle} role="tablist" aria-label="Exercise categories">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={categoryButtonStyle(selectedCategory === cat)}
            role="tab"
            aria-selected={selectedCategory === cat}
            aria-controls="exercise-list"
          >
            {cat}
          </button>
        ))}
      </div>
      
      <div id="exercise-list" role="tabpanel">
        {filteredExercises.map(exercise => {
          const [isHovered, setIsHovered] = useState(false);
          const isAnimated = animatedItem === exercise.name;
          
          return (
            <div 
              key={exercise.name} 
              style={exerciseCardStyle(isHovered, isAnimated)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              tabIndex="0"
              role="button"
              aria-pressed="false"
            >
              <h4 style={exerciseNameStyle}>{exercise.name}</h4>
              <div style={{ marginBottom: theme.spacing.sm }}>
                <span style={categoryBadgeStyle}>{exercise.category}</span>
                <span style={difficultyBadgeStyle(exercise.difficulty)}>{exercise.difficulty}</span>
              </div>
              <div style={{ marginBottom: theme.spacing.sm }}>
                {exercise.muscles.map(muscle => (
                  <span key={muscle} style={muscleTagStyle}>{muscle}</span>
                ))}
              </div>
              <p style={descriptionStyle}>{exercise.description}</p>
              <button 
                onClick={() => handleExerciseSelection(exercise)} 
                style={{
                  ...selectButtonStyle,
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                  transition: theme.transitions.fast
                }}
                aria-label={`Select ${exercise.name}`}
              >
                Select Exercise
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function RestTimer() {
  const [remainingTime, setRemainingTime] = useState(60);
  const [initialTime, setInitialTime] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [customTime, setCustomTime] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);

  // Calculate progress percentage for the circular timer
  const progress = (remainingTime / initialTime) * 100;

  useEffect(() => {
    let timer;
    if (isActive && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
    } else if (isActive && remainingTime === 0) {
      setIsActive(false);
      setShowAnimation(true);
      // Reset animation after a delay
      setTimeout(() => {
        setShowAnimation(false);
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [isActive, remainingTime]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setRemainingTime(initialTime);
  };

  const handlePresetSelect = (seconds) => {
    setIsActive(false);
    setRemainingTime(seconds);
    setInitialTime(seconds);
  };

  const handleCustomTimeChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setCustomTime(value);
    }
  };

  const handleCustomTimeSet = () => {
    const time = parseInt(customTime, 10);
    if (!isNaN(time) && time > 0) {
      handlePresetSelect(time);
      setCustomTime("");
    }
  };

  // Format time to mm:ss
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const containerStyle = {
    backgroundColor: theme.colors.background.accent,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.lg,
    boxShadow: theme.shadows.medium,
    marginBottom: theme.spacing.lg,
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

  const timerContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  };

  const circularTimerStyle = {
    position: "relative",
    width: "200px",
    height: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
  };

  const circleBackgroundStyle = {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    backgroundColor: theme.colors.background.secondary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const progressRingStyle = {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: `conic-gradient(
      ${theme.colors.accent.primary} ${progress}%, 
      transparent ${progress}%
    )`,
    transform: "rotate(-90deg)",
  };

  const innerCircleStyle = {
    width: "85%",
    height: "85%",
    borderRadius: "50%",
    backgroundColor: theme.colors.background.primary,
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  };

  const timerDisplayStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: theme.colors.text.primary,
    zIndex: 2,
    animation: showAnimation ? "pulse 0.5s infinite" : "none",
  };

  const buttonContainerStyle = {
    display: "flex",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    width: "100%",
    justifyContent: "center",
  };

  const buttonStyle = (type) => ({
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    backgroundColor: 
      type === "start" ? theme.colors.accent.success :
      type === "pause" ? theme.colors.accent.warning :
      type === "reset" ? theme.colors.accent.danger :
      theme.colors.accent.primary,
    color: theme.colors.text.light,
    border: "none",
    borderRadius: theme.borderRadius.small,
    cursor: "pointer",
    transition: theme.transitions.fast,
    flex: 1,
    maxWidth: "120px",
    fontWeight: "bold",
    boxShadow: theme.shadows.small,
    ":hover": {
      transform: "translateY(-2px)",
      boxShadow: theme.shadows.medium,
    },
  });

  const presetsContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.md,
  };

  const presetsHeadingStyle = {
    color: theme.colors.text.primary,
    fontSize: theme.typography.text.md,
    fontWeight: 600,
    marginBottom: theme.spacing.sm,
  };

  const presetButtonsStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  };

  const presetButtonStyle = (selected) => ({
    padding: theme.spacing.sm,
    backgroundColor: selected ? theme.colors.accent.primary : theme.colors.background.secondary,
    color: selected ? theme.colors.text.light : theme.colors.text.primary,
    border: `1px solid ${selected ? theme.colors.accent.primary : theme.colors.background.accent}`,
    borderRadius: theme.borderRadius.small,
    cursor: "pointer",
    transition: theme.transitions.fast,
    minWidth: "60px",
    textAlign: "center",
  });

  const customTimeContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  };

  const customTimeInputStyle = {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background.secondary,
    color: theme.colors.text.primary,
    border: `1px solid ${theme.colors.background.accent}`,
    borderRadius: theme.borderRadius.small,
    width: "80px",
    textAlign: "center",
  };

  const customTimeButtonStyle = {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.accent.primary,
    color: theme.colors.text.light,
    border: "none",
    borderRadius: theme.borderRadius.small,
    cursor: "pointer",
    transition: theme.transitions.fast,
  };

  // Create CSS keyframes for pulse animation
  const style = document.createElement('style');
  if (!document.head.querySelector('style[data-timer-animation]')) {
    style.setAttribute('data-timer-animation', 'true');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }

  return (
    <div style={containerStyle}>
      <div style={headingStyle}>
        <div style={headingAccentStyle}></div>
        <h3>Rest Timer</h3>
      </div>
      
      <div style={timerContainerStyle}>
        <div style={circularTimerStyle}>
          <div style={progressRingStyle}></div>
          <div style={circleBackgroundStyle}></div>
          <div style={innerCircleStyle}>
            <div style={timerDisplayStyle}>{formatTime(remainingTime)}</div>
          </div>
        </div>
        
        <div style={buttonContainerStyle}>
          {!isActive ? (
            <button
              style={buttonStyle("start")}
              onClick={handleStart}
              aria-label="Start timer"
              disabled={remainingTime === 0}
            >
              Start
            </button>
          ) : (
            <button
              style={buttonStyle("pause")}
              onClick={handlePause}
              aria-label="Pause timer"
            >
              Pause
            </button>
          )}
          <button 
            style={buttonStyle("reset")}
            onClick={handleReset}
            aria-label="Reset timer"
          >
            Reset
          </button>
        </div>
      </div>
      
      <div style={presetsContainerStyle}>
        <h4 style={presetsHeadingStyle}>Presets</h4>
        <div style={presetButtonsStyle}>
          <button
            style={presetButtonStyle(initialTime === 30)}
            onClick={() => handlePresetSelect(30)}
            aria-label="Set timer to 30 seconds"
          >
            30s
          </button>
          <button
            style={presetButtonStyle(initialTime === 60)}
            onClick={() => handlePresetSelect(60)}
            aria-label="Set timer to 60 seconds"
          >
            1min
          </button>
          <button
            style={presetButtonStyle(initialTime === 90)}
            onClick={() => handlePresetSelect(90)}
            aria-label="Set timer to 90 seconds"
          >
            1:30
          </button>
          <button
            style={presetButtonStyle(initialTime === 120)}
            onClick={() => handlePresetSelect(120)}
            aria-label="Set timer to 2 minutes"
          >
            2min
          </button>
          <button
            style={presetButtonStyle(initialTime === 180)}
            onClick={() => handlePresetSelect(180)}
            aria-label="Set timer to 3 minutes"
          >
            3min
          </button>
        </div>
        
        <div style={customTimeContainerStyle}>
          <input
            type="text"
            placeholder="Seconds"
            value={customTime}
            onChange={handleCustomTimeChange}
            style={customTimeInputStyle}
            aria-label="Custom time in seconds"
          />
          <button
            style={customTimeButtonStyle}
            onClick={handleCustomTimeSet}
            aria-label="Set custom time"
          >
            Set
          </button>
        </div>
      </div>
    </div>
  );
}

export function WorkoutTemplates({ onSelectTemplate }) {
  const [hoveredTemplate, setHoveredTemplate] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  const templates = [
    {
      name: "Upper Body Strength",
      description: "Focus on building strength in chest, shoulders, back and arms",
      exercises: [
        { name: "Bench Press", sets: 4, reps: 6 },
        { name: "Overhead Press", sets: 4, reps: 6 },
        { name: "Barbell Row", sets: 4, reps: 8 },
        { name: "Pull-ups", sets: 3, reps: 8 },
        { name: "Dumbbell Curl", sets: 3, reps: 10 },
        { name: "Tricep Pushdown", sets: 3, reps: 10 }
      ]
    },
    {
      name: "Lower Body Strength",
      description: "Focus on building leg and posterior chain strength",
      exercises: [
        { name: "Barbell Squat", sets: 4, reps: 6 },
        { name: "Deadlift", sets: 4, reps: 5 },
        { name: "Leg Press", sets: 3, reps: 10 },
        { name: "Leg Curl", sets: 3, reps: 10 },
        { name: "Standing Calf Raise", sets: 4, reps: 15 }
      ]
    },
    {
      name: "Full Body Workout",
      description: "Complete workout targeting all major muscle groups",
      exercises: [
        { name: "Barbell Squat", sets: 3, reps: 8 },
        { name: "Bench Press", sets: 3, reps: 8 },
        { name: "Deadlift", sets: 3, reps: 6 },
        { name: "Pull-ups", sets: 3, reps: 8 },
        { name: "Overhead Press", sets: 3, reps: 8 },
        { name: "Dumbbell Curl", sets: 2, reps: 10 }
      ]
    },
    {
      name: "Upper Body Hypertrophy",
      description: "Focus on muscle growth for upper body",
      exercises: [
        { name: "Incline Bench Press", sets: 4, reps: 10 },
        { name: "Lat Pulldown", sets: 4, reps: 10 },
        { name: "Dumbbell Shoulder Press", sets: 3, reps: 12 },
        { name: "Cable Rows", sets: 3, reps: 12 },
        { name: "Lateral Raise", sets: 3, reps: 15 },
        { name: "EZ Bar Curl", sets: 3, reps: 12 },
        { name: "Rope Pushdown", sets: 3, reps: 12 }
      ]
    }
  ];

  const containerStyle = {
    backgroundColor: theme.colors.background.accent,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    boxShadow: theme.shadows.medium,
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

  const templateCardStyle = (isHovered, isSelected) => ({
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    boxShadow: isHovered || isSelected ? theme.shadows.medium : theme.shadows.small,
    border: `1px solid ${isHovered || isSelected ? theme.colors.accent.primary : theme.colors.background.accent}`,
    transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
    transition: `all ${theme.transitions.medium}`,
    position: 'relative',
    overflow: 'hidden',
  });

  const templateTitleStyle = {
    color: theme.colors.text.primary,
    fontWeight: 600,
    margin: "0 0 5px 0",
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
  };

  const templateDescStyle = {
    color: theme.colors.text.secondary,
    fontSize: "14px",
    marginBottom: theme.spacing.sm,
  };

  const exerciseListStyle = {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  };

  const exerciseItemStyle = {
    padding: `${theme.spacing.xs} 0`,
    borderBottom: `1px solid ${theme.colors.background.accent}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: theme.colors.text.secondary,
    fontSize: "14px",
  };
  
  const buttonStyle = (isHovered) => ({
    width: "100%",
    padding: theme.spacing.sm,
    backgroundColor: isHovered ? theme.colors.accent.secondary : theme.colors.accent.primary,
    color: theme.colors.background.primary,
    border: "none",
    borderRadius: theme.borderRadius.small,
    cursor: "pointer",
    marginTop: theme.spacing.md,
    fontWeight: 500,
    transition: theme.transitions.fast,
    transform: isHovered ? 'scale(1.02)' : 'scale(1)',
  });

  const templateBadgeStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.accent.primaryTransparent,
    color: theme.colors.accent.primary,
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    fontSize: '12px',
    fontWeight: 'bold',
  };

  // Handle selecting a template
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template.name);
    // Add a small delay to show the selection animation
    setTimeout(() => {
      onSelectTemplate && onSelectTemplate(template);
    }, 300);
  };

  return (
    <div style={containerStyle}>
      <div style={headingStyle}>
        <div style={headingAccentStyle}></div>
        <h3>Workout Templates</h3>
      </div>
      
      <div role="list" aria-label="Workout templates">
        {templates.map((template, index) => {
          const isHovered = hoveredTemplate === template.name;
          const isSelected = selectedTemplate === template.name;
          
          return (
            <div 
              key={template.name} 
              style={templateCardStyle(isHovered, isSelected)}
              onMouseEnter={() => setHoveredTemplate(template.name)}
              onMouseLeave={() => setHoveredTemplate(null)}
              role="listitem"
              tabIndex="0"
            >
              <h4 style={templateTitleStyle}>
                <span style={templateBadgeStyle}>{index + 1}</span>
                {template.name}
              </h4>
              <p style={templateDescStyle}>{template.description}</p>
              
              <ul style={exerciseListStyle}>
                {template.exercises.map((exercise) => (
                  <li key={`${template.name}-${exercise.name}`} style={exerciseItemStyle}>
                    <span>{exercise.name}</span>
                    <span>{exercise.sets} sets × {exercise.reps} reps</span>
                  </li>
                ))}
              </ul>
              
              <button 
                style={buttonStyle(isHovered)}
                onClick={() => handleTemplateSelect(template)}
                aria-label={`Use ${template.name} template`}
              >
                Use This Template
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}