import React, { useState, useEffect } from "react";

function getWeeklyAverage(nutrition) {
  if (!nutrition.length) return null;

  const totals = nutrition.reduce(
    (acc, entry) => {
      acc.calories += entry.calories;
      acc.protein += entry.protein;
      acc.carbs += entry.carbs;
      acc.fats += entry.fats;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const count = nutrition.length;
  return {
    calories: Math.round(totals.calories / count),
    protein: Math.round(totals.protein / count),
    carbs: Math.round(totals.carbs / count),
    fats: Math.round(totals.fats / count),
  };
}

function SummaryCard({ weeklyAvg, targets }) {
  const highlight = (actual, target) => {
    if (!target) return "black";
    return actual >= target ? "green" : "red";
  };

  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "10px",
      padding: "20px",
      marginBottom: "20px",
      backgroundColor: "#f9f9f9",
      textAlign: "center"
    }}>
      <h3 style={{ marginBottom: "15px" }}>Weekly Nutrition Averages</h3>
      <div style={{ display: "flex", justifyContent: "center", gap: "40px" }}>
        <div>
          <strong>Calories</strong>
          <p style={{ color: highlight(weeklyAvg.calories, targets.calories) }}>{weeklyAvg.calories}</p>
          <small>Target: {targets.calories}</small>
        </div>
        <div>
          <strong>Protein</strong>
          <p style={{ color: highlight(weeklyAvg.protein, targets.protein) }}>{weeklyAvg.protein}g</p>
          <small>Target: {targets.protein}g</small>
        </div>
        <div>
          <strong>Carbs</strong>
          <p style={{ color: highlight(weeklyAvg.carbs, targets.carbs) }}>{weeklyAvg.carbs}g</p>
          <small>Target: {targets.carbs}g</small>
        </div>
        <div>
          <strong>Fats</strong>
          <p style={{ color: highlight(weeklyAvg.fats, targets.fats) }}>{weeklyAvg.fats}g</p>
          <small>Target: {targets.fats}g</small>
        </div>
      </div>
    </div>
  );
}

export default function NutritionDashboard({ nutrition, targets = { calories: 2500, protein: 180, carbs: 300, fats: 70 } }) {
  const [weeklyAvg, setWeeklyAvg] = useState(null);

  useEffect(() => {
    const avg = getWeeklyAverage(nutrition);
    setWeeklyAvg(avg);
  }, [nutrition]);

  return (
    <div>
      {weeklyAvg ? <SummaryCard weeklyAvg={weeklyAvg} targets={targets} /> : <p>No nutrition data to summarize.</p>}
    </div>
  );
}

