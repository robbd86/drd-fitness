import React, { useState } from 'react';
import { theme, commonStyles } from './theme';

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

  const waterCardStyle = {
    border: `1px solid ${theme.colors.background.accent}`,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.accent,
  };

  const inputStyle = {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.small,
    border: theme.components.input.border,
    backgroundColor: theme.components.input.background,
    color: theme.components.input.color,
    minWidth: "150px",
    flex: "1",
    minHeight: "42px",
    transition: theme.transitions.fast,
  };

  const buttonStyle = {
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    backgroundColor: theme.colors.accent.primary,
    color: theme.colors.background.primary,
    border: "none",
    borderRadius: theme.borderRadius.small,
    cursor: "pointer",
    fontWeight: 500,
    transition: theme.transitions.fast,
    minHeight: "42px",
  };

  const progressBgStyle = {
    height: "20px", 
    backgroundColor: theme.colors.background.secondary, 
    borderRadius: theme.borderRadius.small,
    overflow: "hidden",
    border: `1px solid ${theme.colors.background.accent}`,
  };

  const progressFillStyle = (percentage) => ({
    height: "100%", 
    width: `${percentage}%`, 
    backgroundColor: percentage >= 100 ? theme.colors.success : theme.colors.accent.primary,
    transition: "width 0.3s ease"
  });

  return (
    <div style={{
      marginBottom: theme.spacing.xl,
      borderRadius: theme.borderRadius.medium,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background.secondary,
      boxShadow: theme.shadows.small,
      border: `1px solid ${theme.colors.background.accent}`,
    }}>
      <div style={headingStyle}>
        <div style={headingAccentStyle}></div>
        <h3>Water Intake Tracker</h3>
      </div>
      
      <div style={{ 
        display: "flex", 
        alignItems: "center",
        marginBottom: theme.spacing.lg,
        gap: theme.spacing.md,
        flexWrap: "wrap", 
      }}>
        <input
          type="date"
          value={waterDate}
          onChange={(e) => setWaterDate(e.target.value)}
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Water (ml)"
          value={waterAmount}
          onChange={(e) => setWaterAmount(e.target.value)}
          style={inputStyle}
        />
        <button 
          onClick={handleAddWater}
          style={buttonStyle}
        >
          Add Water
        </button>
      </div>

      <div style={{ 
        marginBottom: theme.spacing.lg,
        backgroundColor: theme.colors.background.accent,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.medium,
        display: "inline-block"
      }}>
        <p style={{ margin: 0 }}>Daily Goal: <strong style={{ color: theme.colors.accent.primary }}>{dailyGoal} ml</strong></p>
      </div>

      {Object.keys(groupedWaterLogs).length > 0 ? (
        <div>
          <div style={{ 
            fontSize: theme.typography.body.large, 
            fontWeight: 500, 
            marginBottom: theme.spacing.md,
            color: theme.colors.text.primary 
          }}>
            Recent Water Intake
          </div>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: theme.spacing.md
          }}>
            {Object.entries(groupedWaterLogs)
              .sort((a, b) => new Date(b[0]) - new Date(a[0])) // Sort by date descending
              .slice(0, 7) // Show only most recent 7 days
              .map(([date, amount]) => (
                <div key={date} style={waterCardStyle}>
                  <p style={{ 
                    fontWeight: 600, 
                    marginTop: 0, 
                    marginBottom: theme.spacing.sm,
                    color: theme.colors.text.primary 
                  }}>
                    {date}
                  </p>
                  <p style={{ 
                    marginTop: 0, 
                    marginBottom: theme.spacing.md,
                    color: theme.colors.text.secondary 
                  }}>
                    {amount} ml / {dailyGoal} ml
                  </p>
                  <div style={progressBgStyle}>
                    <div style={progressFillStyle(getPercentage(amount))}></div>
                  </div>
                  <p style={{ 
                    textAlign: "right", 
                    fontSize: "12px", 
                    marginTop: theme.spacing.xs,
                    marginBottom: 0,
                    color: getPercentage(amount) >= 100 ? theme.colors.success : theme.colors.text.secondary
                  }}>
                    {getPercentage(amount)}%
                  </p>
                </div>
              ))
            }
          </div>
        </div>
      ) : (
        <p style={{ color: theme.colors.text.secondary }}>No water intake logged yet. Start tracking your hydration!</p>
      )}
    </div>
  );
}