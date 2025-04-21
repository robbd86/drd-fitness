import React, { useState, useEffect } from 'react';
import { theme } from './theme';

// Water drop SVG icon component
const WaterDropIcon = ({ size = 20, color = theme.colors.accent.primary }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M12 2L5.5 9.6C3.8 11.6 3 13.6 3 15.4c0 4.5 4 8.1 9 8.1s9-3.6 9-8.1c0-1.8-0.8-3.8-2.5-5.8L12 2Z" 
      fill={color} 
      fillOpacity="0.2" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export default function WaterTracker({ waterLogs, setWaterLogs }) {
  const [waterAmount, setWaterAmount] = useState('');
  const [waterDate, setWaterDate] = useState('');
  const [newEntry, setNewEntry] = useState(null);
  const dailyGoal = 2000; // 2000ml or 2L daily goal

  // Set today's date as default when component mounts
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (!waterDate) setWaterDate(today);
  }, []);

  const handleAddWater = () => {
    if (waterAmount && waterDate) {
      const newLog = { date: waterDate, amount: parseInt(waterAmount) };
      setWaterLogs([...waterLogs, newLog]);
      setNewEntry(newLog.date);
      setWaterAmount('');
      
      // Reset animation trigger after 1.5 seconds
      setTimeout(() => {
        setNewEntry(null);
      }, 1500);
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

  // Get appropriate water color based on percentage
  const getWaterColor = (percentage) => {
    if (percentage >= 100) return theme.colors.success;
    if (percentage >= 75) return theme.colors.accent.primary;
    if (percentage >= 50) return theme.colors.accent.secondary;
    if (percentage >= 25) return theme.colors.info;
    return theme.colors.info;
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
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
  };

  const waterCardHoverStyle = {
    transform: "translateY(-3px)",
    boxShadow: theme.shadows.medium,
    border: `1px solid ${theme.colors.accent.secondary}`,
  };

  const inputStyle = {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.small,
    border: `1px solid ${theme.colors.background.accent}`,
    backgroundColor: theme.colors.background.primary,
    color: theme.colors.text.primary,
    minWidth: "150px",
    flex: "1",
    minHeight: "42px",
    transition: theme.transitions.fast,
    outline: "none",
  };

  const inputFocusStyle = {
    borderColor: theme.colors.accent.primary,
    boxShadow: `0 0 0 1px ${theme.colors.accent.primary}25`,
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
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.sm,
  };

  const buttonHoverStyle = {
    backgroundColor: theme.colors.accent.hover,
    transform: "translateY(-1px)",
    boxShadow: theme.shadows.small,
  };

  const progressBgStyle = {
    height: "20px", 
    backgroundColor: theme.colors.background.secondary, 
    borderRadius: theme.borderRadius.small,
    overflow: "hidden",
    border: `1px solid ${theme.colors.background.accent}`,
    position: "relative",
  };

  const progressFillStyle = (percentage) => ({
    height: "100%", 
    width: `${percentage}%`, 
    backgroundColor: getWaterColor(percentage),
    transition: "width 1s ease-out, background-color 1s",
    borderRadius: percentage < 100 ? "0 4px 4px 0" : theme.borderRadius.small,
    background: `
      linear-gradient(
        90deg, 
        ${getWaterColor(percentage)}aa 0%, 
        ${getWaterColor(percentage)} 50%,
        ${getWaterColor(percentage)}aa 100%
      )
    `,
  });

  const goalContainerStyle = {
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.background.accent,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.sm,
    border: `1px solid ${theme.colors.background.accent}`,
    transition: "all 0.3s ease",
  };

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
        <h3 style={{ display: "flex", alignItems: "center", gap: theme.spacing.sm, margin: 0 }}>
          <WaterDropIcon />
          Water Intake Tracker
        </h3>
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
          onFocus={(e) => e.target.style.borderColor = theme.colors.accent.primary}
          onBlur={(e) => e.target.style.borderColor = theme.colors.background.accent}
        />
        <input
          type="number"
          placeholder="Water (ml)"
          value={waterAmount}
          onChange={(e) => setWaterAmount(e.target.value)}
          style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = theme.colors.accent.primary}
          onBlur={(e) => e.target.style.borderColor = theme.colors.background.accent}
        />
        <button 
          onClick={handleAddWater}
          style={buttonStyle}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = theme.colors.accent.hover;
            e.target.style.transform = "translateY(-1px)";
            e.target.style.boxShadow = theme.shadows.small;
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = theme.colors.accent.primary;
            e.target.style.transform = "none";
            e.target.style.boxShadow = "none";
          }}
        >
          <WaterDropIcon size={16} color={theme.colors.background.primary} />
          Add Water
        </button>
      </div>

      <div style={goalContainerStyle}>
        <WaterDropIcon size={24} />
        <p style={{ margin: 0 }}>Daily Goal: <strong style={{ color: theme.colors.accent.primary }}>{dailyGoal} ml</strong></p>
      </div>

      {Object.keys(groupedWaterLogs).length > 0 ? (
        <div>
          <div style={{ 
            fontSize: theme.typography.body.large, 
            fontWeight: 500, 
            marginBottom: theme.spacing.md,
            color: theme.colors.text.primary,
            display: "flex",
            alignItems: "center",
            gap: theme.spacing.sm,
          }}>
            <WaterDropIcon size={16} />
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
              .map(([date, amount]) => {
                const percentage = getPercentage(amount);
                const isNewEntry = date === newEntry;
                
                return (
                  <div 
                    key={date} 
                    style={{
                      ...waterCardStyle,
                      animation: isNewEntry ? "pulse 1.5s ease" : "none",
                      border: isNewEntry ? `1px solid ${theme.colors.accent.primary}` : `1px solid ${theme.colors.background.accent}`,
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = "translateY(-3px)";
                      e.target.style.boxShadow = theme.shadows.medium;
                      e.target.style.borderColor = theme.colors.accent.secondary;
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = "none";
                      e.target.style.boxShadow = "none";
                      e.target.style.borderColor = isNewEntry ? theme.colors.accent.primary : theme.colors.background.accent;
                    }}
                  >
                    <p style={{ 
                      fontWeight: 600, 
                      marginTop: 0, 
                      marginBottom: theme.spacing.sm,
                      color: theme.colors.text.primary,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}>
                      {date}
                      <WaterDropIcon size={16} color={getWaterColor(percentage)} />
                    </p>
                    <p style={{ 
                      marginTop: 0, 
                      marginBottom: theme.spacing.md,
                      color: theme.colors.text.secondary 
                    }}>
                      {amount} ml / {dailyGoal} ml
                    </p>
                    <div style={progressBgStyle}>
                      <div style={progressFillStyle(percentage)}></div>
                    </div>
                    <p style={{ 
                      textAlign: "right", 
                      fontSize: "12px", 
                      marginTop: theme.spacing.xs,
                      marginBottom: 0,
                      color: getPercentage(amount) >= 100 ? theme.colors.success : theme.colors.text.secondary,
                      fontWeight: 500,
                    }}>
                      {getPercentage(amount)}%
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <div style={{ 
          color: theme.colors.text.secondary,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: theme.spacing.xl,
          textAlign: "center"
        }}>
          <WaterDropIcon size={40} color={theme.colors.text.secondary} />
          <p>No water intake logged yet. Start tracking your hydration!</p>
        </div>
      )}
      
      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.03); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}