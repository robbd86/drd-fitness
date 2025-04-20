import React, { useState, useEffect, useRef } from 'react';

// Exercise library data
const exerciseDatabase = [
  {
    category: "Chest",
    exercises: [
      {
        name: "Bench Press", 
        description: "Lie on a flat bench with a barbell, lower it to your chest and press it back up.",
        muscles: "Pectoralis major, anterior deltoids, triceps",
        tips: "Keep your feet flat on the floor, maintain a slight arch in your back, and keep your wrists straight."
      },
      {
        name: "Dumbbell Fly", 
        description: "Lie on a bench with dumbbells, extend arms out to sides in an arc motion.",
        muscles: "Pectoralis major, anterior deltoids",
        tips: "Maintain a slight bend in your elbows throughout the movement to reduce strain on the joints."
      },
      {
        name: "Push Up", 
        description: "Standard bodyweight exercise performed in a prone position.",
        muscles: "Pectoralis major, anterior deltoids, triceps, core",
        tips: "Keep your body in a straight line from head to heels, and position hands slightly wider than shoulder-width."
      }
    ]
  },
  {
    category: "Back",
    exercises: [
      {
        name: "Pull Up", 
        description: "Hang from a bar and pull yourself up until your chin is over the bar.",
        muscles: "Latissimus dorsi, biceps, middle trapezius, rhomboids",
        tips: "Start from a full hang position with arms completely extended and pull your chest to the bar."
      },
      {
        name: "Bent Over Row", 
        description: "Bend at the hips, keep back straight, pull weight to your lower chest/upper abdomen.",
        muscles: "Latissimus dorsi, rhomboids, trapezius, biceps",
        tips: "Keep your back flat throughout the movement and avoid using momentum to lift the weight."
      },
      {
        name: "Lat Pulldown", 
        description: "Seated machine exercise, pull bar down to chest level.",
        muscles: "Latissimus dorsi, biceps, posterior deltoids",
        tips: "Keep your chest up and avoid leaning back excessively to use momentum."
      }
    ]
  },
  {
    category: "Legs",
    exercises: [
      {
        name: "Squat", 
        description: "Lower your body by bending knees and hips, then return to standing position.",
        muscles: "Quadriceps, hamstrings, glutes, lower back",
        tips: "Keep your chest up, push your knees out in the direction of your toes, and drive through your heels."
      },
      {
        name: "Deadlift", 
        description: "Lift a barbell from the ground by extending hips and knees.",
        muscles: "Lower back, glutes, hamstrings, traps",
        tips: "Keep the bar close to your body throughout the movement, and maintain a neutral spine."
      },
      {
        name: "Leg Press", 
        description: "Push weight away using a leg press machine.",
        muscles: "Quadriceps, hamstrings, glutes",
        tips: "Don't lock your knees at the top of the movement and keep your lower back against the pad."
      }
    ]
  },
  {
    category: "Shoulders",
    exercises: [
      {
        name: "Overhead Press", 
        description: "Press weight overhead from shoulder level until arms are fully extended.",
        muscles: "Anterior and lateral deltoids, triceps, trapezius",
        tips: "Keep your core tight and avoid arching your back excessively."
      },
      {
        name: "Lateral Raise", 
        description: "Lift dumbbells out to sides until parallel with floor.",
        muscles: "Lateral deltoids",
        tips: "Use a slight bend in the elbow and avoid using momentum to swing the weights up."
      }
    ]
  },
  {
    category: "Arms",
    exercises: [
      {
        name: "Bicep Curl", 
        description: "Curl weight from extended arm position up toward shoulder.",
        muscles: "Biceps brachii",
        tips: "Keep your upper arms fixed at your sides throughout the movement."
      },
      {
        name: "Tricep Extension", 
        description: "Extend arm from bent position until straight.",
        muscles: "Triceps brachii",
        tips: "Keep your upper arms still and focus on moving only at the elbow joint."
      }
    ]
  }
];

export function ExerciseLibrary({ onSelectExercise }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredExercises = selectedCategory === "All"
    ? exerciseDatabase.flatMap(category => category.exercises)
    : exerciseDatabase.find(c => c.category === selectedCategory)?.exercises || [];
  
  const searchResults = searchQuery
    ? filteredExercises.filter(ex => 
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.muscles.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredExercises;

  return (
    <div style={{ marginBottom: "30px" }}>
      <h3>Exercise Library</h3>
      
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search exercises..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: "8px", width: "100%", marginBottom: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <button 
            onClick={() => setSelectedCategory("All")}
            style={{ 
              padding: "5px 10px", 
              backgroundColor: selectedCategory === "All" ? "#2196F3" : "#e0e0e0",
              color: selectedCategory === "All" ? "white" : "black",
              border: "none", 
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            All
          </button>
          
          {exerciseDatabase.map(category => (
            <button 
              key={category.category}
              onClick={() => setSelectedCategory(category.category)}
              style={{ 
                padding: "5px 10px", 
                backgroundColor: selectedCategory === category.category ? "#2196F3" : "#e0e0e0",
                color: selectedCategory === category.category ? "white" : "black",
                border: "none", 
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              {category.category}
            </button>
          ))}
        </div>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
        {searchResults.map((exercise, index) => (
          <div 
            key={index} 
            style={{ 
              border: "1px solid #ddd", 
              borderRadius: "8px", 
              padding: "15px",
              backgroundColor: "#f9f9f9" 
            }}
          >
            <h4 style={{ marginTop: 0 }}>{exercise.name}</h4>
            <p><strong>Description:</strong> {exercise.description}</p>
            <p><strong>Muscles worked:</strong> {exercise.muscles}</p>
            <p><strong>Tips:</strong> {exercise.tips}</p>
            {onSelectExercise && (
              <button 
                onClick={() => onSelectExercise(exercise.name)}
                style={{ 
                  padding: "8px 16px", 
                  backgroundColor: "#4CAF50", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Use This Exercise
              </button>
            )}
          </div>
        ))}
      </div>
      
      {searchResults.length === 0 && (
        <p>No exercises found. Try a different search term or category.</p>
      )}
    </div>
  );
}

export function RestTimer() {
  const [seconds, setSeconds] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [presets] = useState([30, 60, 90, 120, 180]);
  const intervalRef = useRef(null);
  const [showNotification, setShowNotification] = useState(false);
  
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds <= 1) {
            clearInterval(intervalRef.current);
            setIsActive(false);
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 5000);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(intervalRef.current);
    }
    
    return () => clearInterval(intervalRef.current);
  }, [isActive]);
  
  const handleStart = () => {
    if (seconds > 0) {
      setIsActive(true);
    }
  };
  
  const handlePause = () => {
    setIsActive(false);
  };
  
  const handleReset = () => {
    setIsActive(false);
    setSeconds(60);
  };
  
  const setTime = (time) => {
    setIsActive(false);
    setSeconds(time);
  };
  
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  return (
    <div style={{ 
      border: "1px solid #ccc", 
      borderRadius: "10px", 
      padding: "20px", 
      marginBottom: "20px",
      backgroundColor: isActive ? "#e8f5e9" : "#f9f9f9",
      position: "relative"
    }}>
      {showNotification && (
        <div style={{ 
          position: "absolute", 
          top: 0, 
          left: 0, 
          right: 0, 
          backgroundColor: "#4CAF50", 
          color: "white", 
          padding: "10px", 
          borderRadius: "10px 10px 0 0", 
          textAlign: "center",
          animation: "fadeIn 0.5s"
        }}>
          Time's up! Rest complete.
        </div>
      )}
      
      <h3>Rest Timer</h3>
      
      <div style={{ fontSize: "3rem", textAlign: "center", margin: "20px 0" }}>
        {formatTime(seconds)}
      </div>
      
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
        {!isActive ? (
          <button 
            onClick={handleStart}
            style={{ padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px" }}
          >
            Start
          </button>
        ) : (
          <button 
            onClick={handlePause}
            style={{ padding: "10px 20px", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "4px" }}
          >
            Pause
          </button>
        )}
        <button 
          onClick={handleReset}
          style={{ padding: "10px 20px", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "4px" }}
        >
          Reset
        </button>
      </div>
      
      <div style={{ marginTop: "10px" }}>
        <p style={{ marginBottom: "10px" }}>Presets:</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {presets.map((preset) => (
            <button 
              key={preset}
              onClick={() => setTime(preset)}
              style={{ 
                padding: "8px 12px", 
                backgroundColor: seconds === preset ? "#bbdefb" : "#e0e0e0", 
                border: "none", 
                borderRadius: "4px" 
              }}
            >
              {formatTime(preset)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WorkoutTemplates({ onSelectTemplate }) {
  const templates = [
    {
      name: "Push Workout (Chest, Shoulders, Triceps)",
      exercises: [
        { name: "Bench Press", sets: 4, reps: "8-10" },
        { name: "Overhead Press", sets: 3, reps: "8-12" },
        { name: "Incline Dumbbell Press", sets: 3, reps: "10-12" },
        { name: "Lateral Raises", sets: 3, reps: "12-15" },
        { name: "Tricep Pushdowns", sets: 3, reps: "12-15" },
        { name: "Overhead Tricep Extension", sets: 3, reps: "12-15" }
      ]
    },
    {
      name: "Pull Workout (Back, Biceps)",
      exercises: [
        { name: "Pull Ups", sets: 4, reps: "max" },
        { name: "Bent Over Row", sets: 4, reps: "8-10" },
        { name: "Lat Pulldown", sets: 3, reps: "10-12" },
        { name: "Face Pulls", sets: 3, reps: "12-15" },
        { name: "Bicep Curls", sets: 3, reps: "12-15" },
        { name: "Hammer Curls", sets: 3, reps: "12-15" }
      ]
    },
    {
      name: "Leg Workout",
      exercises: [
        { name: "Squat", sets: 4, reps: "6-10" },
        { name: "Romanian Deadlift", sets: 3, reps: "8-10" },
        { name: "Leg Press", sets: 3, reps: "10-12" },
        { name: "Walking Lunges", sets: 3, reps: "12 each leg" },
        { name: "Leg Extensions", sets: 3, reps: "12-15" },
        { name: "Leg Curls", sets: 3, reps: "12-15" },
        { name: "Calf Raises", sets: 4, reps: "15-20" }
      ]
    },
    {
      name: "Full Body Workout",
      exercises: [
        { name: "Squat", sets: 3, reps: "8-10" },
        { name: "Bench Press", sets: 3, reps: "8-10" },
        { name: "Bent Over Row", sets: 3, reps: "8-10" },
        { name: "Overhead Press", sets: 3, reps: "8-12" },
        { name: "Leg Press", sets: 3, reps: "10-12" },
        { name: "Lat Pulldown", sets: 3, reps: "10-12" },
        { name: "Bicep Curls", sets: 2, reps: "12-15" },
        { name: "Tricep Pushdown", sets: 2, reps: "12-15" }
      ]
    }
  ];

  return (
    <div style={{ marginBottom: "30px" }}>
      <h3>Workout Templates</h3>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
        {templates.map((template, index) => (
          <div 
            key={index} 
            style={{ 
              border: "1px solid #ddd", 
              borderRadius: "8px", 
              padding: "15px",
              backgroundColor: "#f9f9f9" 
            }}
          >
            <h4 style={{ marginTop: 0 }}>{template.name}</h4>
            <ul style={{ paddingLeft: "20px" }}>
              {template.exercises.map((ex, i) => (
                <li key={i}>{ex.name}: {ex.sets} sets × {ex.reps} reps</li>
              ))}
            </ul>
            {onSelectTemplate && (
              <button 
                onClick={() => onSelectTemplate(template)}
                style={{ 
                  padding: "8px 16px", 
                  backgroundColor: "#4CAF50", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Use This Template
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}