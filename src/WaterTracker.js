import React, { useState } from 'react';

export default function WaterTracker({ waterLogs, setWaterLogs }) {
  const [waterAmount, setWaterAmount] = useState('');
  const [waterDate, setWaterDate] = useState('');
  const dailyGoal = 2000; // 2000ml or 2L daily goal

  const handleAddWater = () => {
    if (waterAmount && waterDate) {
      setWaterLogs([
        ...waterLogs,
        { date: waterDate, amount: parseInt(waterAmount) }
      ]);
      setWaterAmount('');
      setWaterDate('');
    }
  };

  // Group water logs by date
  const groupedWaterLogs = waterLogs.reduce((acc, log) => {
    if (!acc[log.date]) {
      acc[log.date] = 0;
    }
    acc[log.date] += log.amount;
    return acc;
  }, {});

  // Calculate percentage for visual representation
  const getPercentage = (amount) => {
    return Math.min(100, Math.round((amount / dailyGoal) * 100));
  };

  return (
    <div style={{ marginBottom: "30px" }}>
      <h3>Water Intake Tracker</h3>
      
      <div style={{ 
        display: "flex", 
        alignItems: "center",
        marginBottom: "20px",
        gap: "10px" 
      }}>
        <input
          type="date"
          value={waterDate}
          onChange={(e) => setWaterDate(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="number"
          placeholder="Water (ml)"
          value={waterAmount}
          onChange={(e) => setWaterAmount(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button 
          onClick={handleAddWater}
          style={{ padding: "8px 16px", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "4px" }}
        >
          Add Water
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <p>Daily Goal: <strong>{dailyGoal} ml</strong></p>
      </div>

      {Object.keys(groupedWaterLogs).length > 0 ? (
        <div>
          <h4>Recent Water Intake</h4>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "15px"
          }}>
            {Object.entries(groupedWaterLogs)
              .sort((a, b) => new Date(b[0]) - new Date(a[0])) // Sort by date descending
              .slice(0, 7) // Show only most recent 7 days
              .map(([date, amount]) => (
                <div key={date} style={{ 
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "10px",
                  backgroundColor: "#f9f9f9"
                }}>
                  <p><strong>{date}</strong></p>
                  <p>{amount} ml / {dailyGoal} ml</p>
                  <div style={{ 
                    height: "20px", 
                    backgroundColor: "#e1e1e1", 
                    borderRadius: "10px",
                    overflow: "hidden"
                  }}>
                    <div style={{ 
                      height: "100%", 
                      width: `${getPercentage(amount)}%`, 
                      backgroundColor: getPercentage(amount) >= 100 ? "#4CAF50" : "#2196F3",
                      transition: "width 0.3s ease"
                    }}></div>
                  </div>
                  <p style={{ textAlign: "right", fontSize: "12px", marginTop: "5px" }}>
                    {getPercentage(amount)}%
                  </p>
                </div>
              ))
            }
          </div>
        </div>
      ) : (
        <p>No water intake logged yet. Start tracking your hydration!</p>
      )}
    </div>
  );
}