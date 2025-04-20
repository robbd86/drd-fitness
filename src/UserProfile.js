import React, { useState } from "react";

export default function UserProfile({ profileData, setProfileData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({...profileData});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfileData(formData);
    setIsEditing(false);
  };

  return (
    <div style={{ marginBottom: "30px" }}>
      <h2>My Profile & Goals</h2>
      
      {isEditing ? (
        <form onSubmit={handleSubmit} style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
          marginBottom: "20px"
        }}>
          <div>
            <h3>Personal Info</h3>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Height (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>
          </div>

          <div>
            <h3>Body Measurements</h3>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Body Fat %</label>
              <input
                type="number"
                name="bodyFat"
                value={formData.bodyFat}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Chest (cm)</label>
              <input
                type="number"
                name="chest"
                value={formData.chest}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Waist (cm)</label>
              <input
                type="number"
                name="waist"
                value={formData.waist}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>
          </div>

          <div>
            <h3>Nutrition Goals</h3>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Target Calories</label>
              <input
                type="number"
                name="targetCalories"
                value={formData.targetCalories}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Target Protein (g)</label>
              <input
                type="number"
                name="targetProtein"
                value={formData.targetProtein}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Target Carbs (g)</label>
              <input
                type="number"
                name="targetCarbs"
                value={formData.targetCarbs}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Target Fats (g)</label>
              <input
                type="number"
                name="targetFats"
                value={formData.targetFats}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>
          </div>

          <div>
            <h3>Fitness Goals</h3>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Target Weight (kg)</label>
              <input
                type="number"
                name="targetWeight"
                value={formData.targetWeight}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Weekly Workout Goal</label>
              <input
                type="number"
                name="workoutGoal"
                value={formData.workoutGoal}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Goal Description</label>
              <textarea
                name="goalDescription"
                value={formData.goalDescription}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", height: "80px" }}
              />
            </div>
          </div>

          <div style={{ gridColumn: "1 / -1", textAlign: "center", marginTop: "20px" }}>
            <button 
              type="submit" 
              style={{ padding: "10px 20px", marginRight: "10px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px" }}
            >
              Save Profile
            </button>
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              style={{ padding: "10px 20px", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "4px" }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
            marginBottom: "20px" 
          }}>
            <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px", backgroundColor: "#f9f9f9" }}>
              <h3>Personal Info</h3>
              <p><strong>Name:</strong> {profileData.name}</p>
              <p><strong>Age:</strong> {profileData.age}</p>
              <p><strong>Height:</strong> {profileData.height} cm</p>
            </div>
            
            <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px", backgroundColor: "#f9f9f9" }}>
              <h3>Body Measurements</h3>
              <p><strong>Body Fat:</strong> {profileData.bodyFat}%</p>
              <p><strong>Chest:</strong> {profileData.chest} cm</p>
              <p><strong>Waist:</strong> {profileData.waist} cm</p>
            </div>
            
            <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px", backgroundColor: "#f9f9f9" }}>
              <h3>Nutrition Goals</h3>
              <p><strong>Calories:</strong> {profileData.targetCalories}</p>
              <p><strong>Protein:</strong> {profileData.targetProtein}g</p>
              <p><strong>Carbs:</strong> {profileData.targetCarbs}g</p>
              <p><strong>Fats:</strong> {profileData.targetFats}g</p>
            </div>
            
            <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px", backgroundColor: "#f9f9f9" }}>
              <h3>Fitness Goals</h3>
              <p><strong>Target Weight:</strong> {profileData.targetWeight} kg</p>
              <p><strong>Weekly Workouts:</strong> {profileData.workoutGoal}</p>
              <p><strong>Goal:</strong> {profileData.goalDescription}</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsEditing(true)}
            style={{ padding: "10px 20px", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "4px" }}
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}