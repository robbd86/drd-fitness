import React, { useState, useEffect } from "react";
import { theme, commonStyles } from "./theme";

function getWeeklyAverage(nutrition) {
  if (!nutrition || !Array.isArray(nutrition) || !nutrition.length) return null;

  const totals = nutrition.reduce(
    (acc, entry) => {
      acc.calories += entry.calories || 0;
      acc.protein += entry.protein || 0;
      acc.carbs += entry.carbs || 0;
      acc.fat += entry.fat || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const count = nutrition.length;
  return {
    calories: Math.round(totals.calories / count),
    protein: Math.round(totals.protein / count),
    carbs: Math.round(totals.carbs / count),
    fat: Math.round(totals.fat / count),
  };
}

function SummaryCard({ weeklyAvg, targets }) {
  // If weeklyAvg is null or not an object, show a loading message
  if (!weeklyAvg || typeof weeklyAvg !== 'object') {
    return <div>Loading nutrition data...</div>;
  }

  const highlight = (actual, target) => {
    if (!target) return theme.colors.text.primary;
    return actual >= target ? theme.colors.success : theme.colors.error;
  };

  const statCardStyle = {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.background.accent,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "120px",
  };

  const statNumberStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    margin: "10px 0",
  };

  const statLabelStyle = {
    fontSize: "14px",
    color: theme.colors.text.secondary,
    margin: 0,
  };

  const targetStyle = {
    fontSize: "12px",
    color: theme.colors.text.secondary,
    margin: 0,
  };
  
  return (
    <div style={{
      borderRadius: theme.borderRadius.medium,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      backgroundColor: theme.colors.background.secondary,
      boxShadow: theme.shadows.small,
      border: `1px solid ${theme.colors.background.accent}`,
    }}>
      <h3 style={{ 
        marginBottom: theme.spacing.md, 
        color: theme.colors.text.primary,
        fontSize: theme.typography.heading.h3,
        position: "relative",
        paddingLeft: theme.spacing.md,
        display: "flex",
        alignItems: "center",
      }}>
        <div style={{
          width: "3px",
          height: "20px",
          backgroundColor: theme.colors.accent.primary,
          position: "absolute",
          left: "0",
          borderRadius: theme.borderRadius.small,
        }}></div>
        Weekly Nutrition Averages
      </h3>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-around", 
        flexWrap: "wrap", 
        gap: theme.spacing.md 
      }}>
        <div style={statCardStyle}>
          <p style={statLabelStyle}>Calories</p>
          <p style={{...statNumberStyle, color: highlight(weeklyAvg?.calories || 0, targets?.calories)}}>{weeklyAvg?.calories || 0}</p>
          <p style={targetStyle}>Target: {targets?.calories || 'N/A'}</p>
        </div>
        <div style={statCardStyle}>
          <p style={statLabelStyle}>Protein</p>
          <p style={{...statNumberStyle, color: highlight(weeklyAvg?.protein || 0, targets?.protein)}}>{weeklyAvg?.protein || 0}g</p>
          <p style={targetStyle}>Target: {targets?.protein || 'N/A'}g</p>
        </div>
        <div style={statCardStyle}>
          <p style={statLabelStyle}>Carbs</p>
          <p style={{...statNumberStyle, color: highlight(weeklyAvg?.carbs || 0, targets?.carbs)}}>{weeklyAvg?.carbs || 0}g</p>
          <p style={targetStyle}>Target: {targets?.carbs || 'N/A'}g</p>
        </div>
        <div style={statCardStyle}>
          <p style={statLabelStyle}>Fat</p>
          <p style={{...statNumberStyle, color: highlight(weeklyAvg?.fat || 0, targets?.fat)}}>{weeklyAvg?.fat || 0}g</p>
          <p style={targetStyle}>Target: {targets?.fat || 'N/A'}g</p>
        </div>
      </div>
    </div>
  );
}

export default function NutritionDashboard({ nutrition, targets = { calories: 2500, protein: 180, carbs: 300, fat: 70 } }) {
  const [weeklyAvg, setWeeklyAvg] = useState(null);

  useEffect(() => {
    const avg = getWeeklyAverage(nutrition);
    setWeeklyAvg(avg);
  }, [nutrition]);

  return (
    <div>
      {weeklyAvg ? (
        <SummaryCard weeklyAvg={weeklyAvg} targets={targets} />
      ) : (
        <p style={{ color: theme.colors.text.secondary }}>No nutrition data to summarize.</p>
      )}
    </div>
  );
}

