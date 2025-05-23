import React, { useState, useEffect } from 'react';
import './App.css';
import { theme } from './theme';
import UserProfile from './UserProfile';
import { ExerciseLibrary, RestTimer, WorkoutTemplates } from './WorkoutFeatures';
import NutritionDashboard from './NutritionDashboard';
import WaterTracker from './WaterTracker';
import Achievements from './Achievements';
import Authentication, { validateToken } from './Authentication';

// Sample data that would normally come from an API/database
const mockData = {
  profile: {
    name: 'Alex Johnson',
    age: 28,
    height: 175, // cm
    currentWeight: 75, // kg
    targetWeight: 70, // kg
    activity: 'moderate',
    goal: 'weight_loss'
  },
  weightEntries: [
    { date: '2023-01-01', weight: 80 },
    { date: '2023-01-15', weight: 78 },
    { date: '2023-02-01', weight: 76 },
    { date: '2023-02-15', weight: 75 }
  ],
  workouts: [
    { 
      date: '2023-02-10', 
      type: 'strength', 
      duration: 45,
      exercises: [
        { name: 'Bench Press', sets: 3, reps: 10, weight: 70 },
        { name: 'Squat', sets: 3, reps: 12, weight: 100 },
        { name: 'Deadlift', sets: 3, reps: 8, weight: 120 }
      ]
    },
    { 
      date: '2023-02-12', 
      type: 'cardio', 
      duration: 30,
      details: { distance: 5, caloriesBurned: 320 }
    },
    { 
      date: '2023-02-14', 
      type: 'strength', 
      duration: 50,
      exercises: [
        { name: 'Pull-ups', sets: 3, reps: 8, weight: 0 },
        { name: 'Rows', sets: 3, reps: 12, weight: 60 },
        { name: 'Shoulder Press', sets: 3, reps: 10, weight: 40 }
      ]
    }
  ],
  nutrition: [
    { date: '2023-02-13', calories: 2100, protein: 130, carbs: 210, fat: 70 },
    { date: '2023-02-14', calories: 2000, protein: 140, carbs: 180, fat: 75 },
    { date: '2023-02-15', calories: 2050, protein: 135, carbs: 200, fat: 72 }
  ],
  waterLogs: [
    { date: '2023-02-13', amount: 2200 }, // ml
    { date: '2023-02-14', amount: 2500 },
    { date: '2023-02-15', amount: 1900 }
  ]
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  // Store profile and other data in state so they can be updated
  const [profileData, setProfileData] = useState(mockData.profile);
  const [weightEntries, setWeightEntries] = useState(mockData.weightEntries);
  const [workouts, setWorkouts] = useState(mockData.workouts);
  const [nutrition, setNutrition] = useState(mockData.nutrition);
  const [waterLogs, setWaterLogs] = useState(mockData.waterLogs);

  // Check authentication on component mount
  useEffect(() => {
    const token = validateToken();
    if (token) {
      setIsAuthenticated(true);
      setUserData({ id: token.id, email: token.email });
      // In a real app, you would fetch user data from an API using the token
    }
  }, []);

  // Handle successful authentication
  const handleAuthenticated = (user) => {
    setIsAuthenticated(true);
    setUserData(user);
    // You would typically fetch real user data here
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUserData(null);
  };

  // Function to update profile data
  const handleUpdateProfile = (updatedProfile) => {
    setProfileData(updatedProfile);
    console.log('Profile updated:', updatedProfile);
  };
  
  // App-level styles according to the new dark theme
  const appStyle = {
    backgroundColor: theme.colors.background.primary,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily,
    minHeight: "100vh",
    padding: theme.spacing.md
  };

  const mainContainerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: theme.spacing.lg,
  };
  
  const headerStyle = {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    boxShadow: theme.shadows.small,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };
  
  const logoStyle = {
    fontSize: theme.typography.heading.h1,
    fontWeight: "bold",
    margin: `${theme.spacing.sm} 0`,
    color: theme.colors.accent.primary,
  };

  const subheadingStyle = {
    fontSize: theme.typography.body.large,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  };
  
  const navStyle = {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    width: "100%",
    marginTop: theme.spacing.md,
  };
  
  const navItemStyle = (isActive) => ({
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    backgroundColor: isActive ? theme.colors.accent.primary : "transparent",
    color: isActive ? theme.colors.background.primary : theme.colors.text.primary,
    borderRadius: theme.borderRadius.pill,
    textDecoration: "none",
    fontWeight: 500,
    border: isActive ? "none" : `1px solid ${theme.colors.background.accent}`,
    cursor: "pointer",
    transition: theme.transitions.fast,
  });
  
  const contentStyle = {
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.medium,
    boxShadow: theme.shadows.medium,
  };

  const logoutButtonStyle = {
    marginLeft: 'auto',
    backgroundColor: theme.colors.error,
    color: '#fff',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.pill,
    border: 'none',
    cursor: 'pointer',
  };
  
  // If not authenticated, show the Authentication component
  if (!isAuthenticated) {
    return (
      <div style={appStyle}>
        <div style={mainContainerStyle}>
          <header style={headerStyle}>
            <h1 style={logoStyle}>DRD Fitness</h1>
            <p style={subheadingStyle}>Track your progress. Achieve your goals.</p>
          </header>
          <main style={contentStyle}>
            <Authentication onAuthenticated={handleAuthenticated} />
          </main>
        </div>
      </div>
    );
  }
  
  return (
    <div style={appStyle}>
      <div style={mainContainerStyle}>
        <header style={headerStyle}>
          <h1 style={logoStyle}>DRD Fitness</h1>
          <p style={subheadingStyle}>Track your progress. Achieve your goals.</p>
          
          <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
            <nav style={{ ...navStyle, flex: 1 }}>
              <button 
                onClick={() => setActiveTab('profile')} 
                style={navItemStyle(activeTab === 'profile')}
              >
                Profile
              </button>
              <button 
                onClick={() => setActiveTab('workouts')} 
                style={navItemStyle(activeTab === 'workouts')}
              >
                Workouts
              </button>
              <button 
                onClick={() => setActiveTab('nutrition')} 
                style={navItemStyle(activeTab === 'nutrition')}
              >
                Nutrition
              </button>
              <button 
                onClick={() => setActiveTab('water')} 
                style={navItemStyle(activeTab === 'water')}
              >
                Water Tracker
              </button>
              <button 
                onClick={() => setActiveTab('achievements')} 
                style={navItemStyle(activeTab === 'achievements')}
              >
                Progress & Achievements
              </button>
            </nav>
            <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
          </div>
        </header>
        
        <main style={contentStyle}>
          {activeTab === 'profile' && (
            <UserProfile 
              profile={profileData} 
              weightEntries={weightEntries} 
              onUpdateProfile={handleUpdateProfile}
              userData={userData}
            />
          )}
          {activeTab === 'workouts' && (
            <div>
              <WorkoutTemplates onSelectTemplate={(template) => console.log('Selected template:', template)} />
              <ExerciseLibrary onSelectExercise={(exercise) => console.log('Selected exercise:', exercise)} />
              <RestTimer />
            </div>
          )}
          {activeTab === 'nutrition' && (
            <NutritionDashboard nutrition={nutrition} />
          )}
          {activeTab === 'water' && (
            <WaterTracker waterLogs={waterLogs} setWaterLogs={setWaterLogs} />
          )}
          {activeTab === 'achievements' && (
            <Achievements 
              entries={weightEntries}
              workouts={workouts}
              nutrition={nutrition}
              waterLogs={waterLogs}
              profileData={profileData}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;




