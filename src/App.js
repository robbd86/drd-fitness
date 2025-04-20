import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import NutritionDashboard from "./NutritionDashboard";
import UserProfile from "./UserProfile";
import WaterTracker from "./WaterTracker";
import { ExerciseLibrary, RestTimer, WorkoutTemplates } from "./WorkoutFeatures";
import Achievements from "./Achievements";

export default function App() {
  const [activeTab, setActiveTab] = useState("progress");

  // Load data from localStorage on initial load
  useEffect(() => {
    const savedProfile = localStorage.getItem('profileData');
    const savedEntries = localStorage.getItem('entries');
    const savedWorkouts = localStorage.getItem('workouts');
    const savedNutrition = localStorage.getItem('nutrition');
    const savedWaterLogs = localStorage.getItem('waterLogs');
    
    if (savedProfile) setProfileData(JSON.parse(savedProfile));
    if (savedEntries) setEntries(JSON.parse(savedEntries));
    if (savedWorkouts) setWorkouts(JSON.parse(savedWorkouts));
    if (savedNutrition) setNutrition(JSON.parse(savedNutrition));
    if (savedWaterLogs) setWaterLogs(JSON.parse(savedWaterLogs));
  }, []);

  // User Profile State
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    age: 30,
    height: 180,
    bodyFat: 15,
    chest: 100,
    waist: 80,
    targetCalories: 2500,
    targetProtein: 180,
    targetCarbs: 300,
    targetFats: 70,
    targetWeight: 75,
    workoutGoal: 4,
    goalDescription: "Lose 5kg and build muscle definition"
  });

  // Save profile data when it changes
  useEffect(() => {
    localStorage.setItem('profileData', JSON.stringify(profileData));
  }, [profileData]);

  // Progress Tracker State
  const [entries, setEntries] = useState([]);
  
  // Save entries when they change
  useEffect(() => {
    localStorage.setItem('entries', JSON.stringify(entries));
  }, [entries]);
  
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState("");

  // Workout Logger State
  const [workouts, setWorkouts] = useState([]);
  
  // Save workouts when they change
  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);
  
  const [workoutDate, setWorkoutDate] = useState("");
  const [exercise, setExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weightLifted, setWeightLifted] = useState("");
  const [rpe, setRpe] = useState("");

  // Nutrition Tracker State
  const [nutrition, setNutrition] = useState([]);
  
  // Save nutrition when it changes
  useEffect(() => {
    localStorage.setItem('nutrition', JSON.stringify(nutrition));
  }, [nutrition]);
  
  const [nutritionDate, setNutritionDate] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");

  // Water Tracker State
  const [waterLogs, setWaterLogs] = useState([]);
  
  // Save water logs when they change
  useEffect(() => {
    localStorage.setItem('waterLogs', JSON.stringify(waterLogs));
  }, [waterLogs]);

  // Advanced Workout Features
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [showWorkoutTemplates, setShowWorkoutTemplates] = useState(false);

  const addProgressEntry = () => {
    if (date && weight) {
      const newEntry = { date, weight: parseFloat(weight) };
      setEntries([...entries, newEntry]);
      setWeight("");
      setDate("");
    }
  };

  const deleteWorkout = (index) => {
    const updatedWorkouts = [...workouts];
    updatedWorkouts.splice(index, 1);
    setWorkouts(updatedWorkouts);
  };

  const addWorkoutEntry = () => {
    if (workoutDate && exercise && sets && reps && weightLifted) {
      const volume = parseInt(sets) * parseInt(reps) * parseFloat(weightLifted);
      const newWorkout = {
        date: workoutDate,
        exercise,
        sets,
        reps,
        weightLifted,
        rpe,
        volume,
      };
      setWorkouts([...workouts, newWorkout]);
      setWorkoutDate("");
      setExercise("");
      setSets("");
      setReps("");
      setWeightLifted("");
      setRpe("");
    }
  };

  const addNutritionEntry = () => {
    if (nutritionDate && calories && protein && carbs && fats) {
      const newNutrition = {
        date: nutritionDate,
        calories: parseInt(calories),
        protein: parseInt(protein),
        carbs: parseInt(carbs),
        fats: parseInt(fats),
      };
      setNutrition([...nutrition, newNutrition]);
      setNutritionDate("");
      setCalories("");
      setProtein("");
      setCarbs("");
      setFats("");
    }
  };

  const handleSelectExercise = (exerciseName) => {
    setExercise(exerciseName);
    setShowExerciseLibrary(false);
  };

  const handleSelectTemplate = (template) => {
    // Prompt user if they want to add all exercises from the template
    if (window.confirm(`Add all exercises from the "${template.name}" template?`)) {
      // Get today's date in YYYY-MM-DD format for all new entries
      const today = new Date().toISOString().split('T')[0];
      
      // Create new workout entries from the template
      const newWorkouts = template.exercises.map(ex => ({
        date: today,
        exercise: ex.name,
        sets: ex.sets.toString(),
        reps: ex.reps.toString(),
        weightLifted: "0", // User will need to update this
        rpe: "",
        volume: 0
      }));
      
      setWorkouts([...workouts, ...newWorkouts]);
    }
    setShowWorkoutTemplates(false);
  };

  const inputStyle = {
    padding: "8px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    minWidth: "150px",
  };

  const rowStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px",
  };

  const tabButtonStyle = (isActive) => ({
    padding: "10px 20px",
    marginRight: "10px",
    border: "none",
    borderBottom: isActive ? "2px solid #333" : "2px solid transparent",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontWeight: isActive ? "bold" : "normal",
  });

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>DRD Fitness</h1>

      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <button
          onClick={() => setActiveTab("dashboard")}
          style={tabButtonStyle(activeTab === "dashboard")}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          style={tabButtonStyle(activeTab === "profile")}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("progress")}
          style={tabButtonStyle(activeTab === "progress")}
        >
          Progress Tracker
        </button>
        <button
          onClick={() => setActiveTab("workouts")}
          style={tabButtonStyle(activeTab === "workouts")}
        >
          Workout Logger
        </button>
        <button
          onClick={() => setActiveTab("nutrition")}
          style={tabButtonStyle(activeTab === "nutrition")}
        >
          Nutrition Tracker
        </button>
      </div>

      {activeTab === "profile" && (
        <UserProfile profileData={profileData} setProfileData={setProfileData} />
      )}

      {activeTab === "dashboard" && (
        <>
          <h2>Fitness Dashboard</h2>
          
          <Achievements 
            entries={entries} 
            workouts={workouts} 
            nutrition={nutrition} 
            waterLogs={waterLogs}
            profileData={profileData}
          />
          
          <NutritionDashboard 
            nutrition={nutrition} 
            targets={{
              calories: profileData.targetCalories,
              protein: profileData.targetProtein,
              carbs: profileData.targetCarbs,
              fats: profileData.targetFats
            }}
          />
          
          {entries.length > 0 && (
            <>
              <h3>Weight Progress</h3>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <div style={{ marginRight: "15px", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "5px" }}>
                  <p style={{ margin: 0 }}>Target: <strong>{profileData.targetWeight} kg</strong></p>
                </div>
                {entries.length > 0 && (
                  <div style={{ padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "5px" }}>
                    <p style={{ margin: 0 }}>Current: <strong>{entries[entries.length-1].weight} kg</strong></p>
                  </div>
                )}
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={entries}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}

          {workouts.length > 0 && (
            <div style={{ marginTop: "30px" }}>
              <h3>Recent Workouts</h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "8px" }}>Date</th>
                    <th style={{ textAlign: "left", padding: "8px" }}>Exercise</th>
                    <th style={{ textAlign: "left", padding: "8px" }}>Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {workouts.slice(-5).map((w, index) => (
                    <tr key={index}>
                      <td style={{ padding: "8px" }}>{w.date}</td>
                      <td style={{ padding: "8px" }}>{w.exercise}</td>
                      <td style={{ padding: "8px" }}>{w.volume}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {activeTab === "progress" && (
        <>
          <div style={rowStyle}>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="Body Weight (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              style={inputStyle}
            />
            <button onClick={addProgressEntry} style={{ padding: "8px 16px" }}>
              Add Entry
            </button>
          </div>

          <h2>Progress Chart</h2>
          {entries.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={entries}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No data yet. Add your first entry above!</p>
          )}
        </>
      )}

      {activeTab === "workouts" && (
        <>
          <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button 
              onClick={() => setShowExerciseLibrary(!showExerciseLibrary)}
              style={{ 
                padding: "10px 20px", 
                backgroundColor: "#2196F3", 
                color: "white", 
                border: "none", 
                borderRadius: "4px"
              }}
            >
              {showExerciseLibrary ? "Hide Exercise Library" : "Show Exercise Library"}
            </button>
            
            <button 
              onClick={() => setShowWorkoutTemplates(!showWorkoutTemplates)}
              style={{ 
                padding: "10px 20px", 
                backgroundColor: "#9c27b0", 
                color: "white", 
                border: "none", 
                borderRadius: "4px"
              }}
            >
              {showWorkoutTemplates ? "Hide Templates" : "Show Workout Templates"}
            </button>
          </div>

          {showExerciseLibrary && (
            <ExerciseLibrary onSelectExercise={handleSelectExercise} />
          )}
          
          {showWorkoutTemplates && (
            <WorkoutTemplates onSelectTemplate={handleSelectTemplate} />
          )}

          <RestTimer />

          <div style={rowStyle}>
            <input
              type="date"
              value={workoutDate}
              onChange={(e) => setWorkoutDate(e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Exercise"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="Sets"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="Reps"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="Weight (kg)"
              value={weightLifted}
              onChange={(e) => setWeightLifted(e.target.value)}
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="RPE (1–10)"
              value={rpe}
              onChange={(e) => setRpe(e.target.value)}
              style={inputStyle}
            />
            <button onClick={addWorkoutEntry} style={{ padding: "8px 16px" }}>
              Add Workout
            </button>
          </div>

          <h2>Workout Log</h2>
          {workouts.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "8px" }}>Date</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Exercise</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Sets</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Reps</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Weight</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>RPE</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Volume</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {workouts.map((w, index) => (
                  <tr key={index}>
                    <td style={{ padding: "8px" }}>{w.date}</td>
                    <td style={{ padding: "8px" }}>{w.exercise}</td>
                    <td style={{ padding: "8px" }}>{w.sets}</td>
                    <td style={{ padding: "8px" }}>{w.reps}</td>
                    <td style={{ padding: "8px" }}>{w.weightLifted}</td>
                    <td style={{ padding: "8px" }}>{w.rpe}</td>
                    <td style={{ padding: "8px" }}>{w.volume}</td>
                    <td style={{ padding: "8px" }}>
                      <button onClick={() => deleteWorkout(index)} style={{ padding: "4px 8px" }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No workouts logged yet.</p>
          )}
        </>
      )}

      {activeTab === "nutrition" && (
        <>
          <div style={rowStyle}>
            <input
              type="date"
              value={nutritionDate}
              onChange={(e) => setNutritionDate(e.target.value)}
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="Calories"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="Protein (g)"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="Carbs (g)"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="Fats (g)"
              value={fats}
              onChange={(e) => setFats(e.target.value)}
              style={inputStyle}
            />
            <button onClick={addNutritionEntry} style={{ padding: "8px 16px" }}>
              Add Nutrition
            </button>
          </div>
          
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            backgroundColor: "#f0f0f0", 
            padding: "10px", 
            borderRadius: "5px",
            marginBottom: "20px"
          }}>
            <div>
              <strong>Daily Calories Target:</strong> {profileData.targetCalories}
            </div>
            <div>
              <strong>Protein:</strong> {profileData.targetProtein}g
            </div>
            <div>
              <strong>Carbs:</strong> {profileData.targetCarbs}g
            </div>
            <div>
              <strong>Fats:</strong> {profileData.targetFats}g
            </div>
          </div>

          <NutritionDashboard 
            nutrition={nutrition} 
            targets={{
              calories: profileData.targetCalories,
              protein: profileData.targetProtein,
              carbs: profileData.targetCarbs,
              fats: profileData.targetFats
            }}
          />
          
          {nutrition.length > 0 && (
            <div style={{ marginBottom: "30px" }}>
              <h3>Macronutrient Distribution</h3>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Protein", value: nutrition.slice(-1)[0].protein * 4 }, // 4 calories per gram
                        { name: "Carbs", value: nutrition.slice(-1)[0].carbs * 4 }, // 4 calories per gram
                        { name: "Fats", value: nutrition.slice(-1)[0].fats * 9 }, // 9 calories per gram
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#8884d8" />
                      <Cell fill="#82ca9d" />
                      <Cell fill="#ffc658" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <WaterTracker waterLogs={waterLogs} setWaterLogs={setWaterLogs} />

          <h2>Nutrition Log</h2>
          {nutrition.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "8px" }}>Date</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Calories</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Protein</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Carbs</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Fats</th>
                </tr>
              </thead>
              <tbody>
                {nutrition.map((n, index) => (
                  <tr key={index}>
                    <td style={{ padding: "8px" }}>{n.date}</td>
                    <td style={{ padding: "8px" }}>{n.calories}</td>
                    <td style={{ padding: "8px" }}>{n.protein}</td>
                    <td style={{ padding: "8px" }}>{n.carbs}</td>
                    <td style={{ padding: "8px" }}>{n.fats}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No nutrition data logged yet.</p>
          )}
        </>
      )}
    </div>
  );
}




