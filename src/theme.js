// DRD Fitness Modern Dark Theme
// Inspired by the provided screenshot with dark background and yellow-green accents

export const theme = {
  colors: {
    // Main background colors
    background: {
      primary: '#121c23',      // Dark blue-black main background
      secondary: '#1a252d',    // Slightly lighter panel background
      accent: '#242f38',       // Even lighter background for cards/highlights
    },
    
    // Text colors
    text: {
      primary: '#ffffff',      // Bright white for main text
      secondary: '#a7b5c1',    // Light grey for secondary/supporting text
      accent: '#d2e833',       // Yellow-green for highlighted text
    },
    
    // Accent colors (brand colors)
    accent: {
      primary: '#c3e61c',      // Main bright yellow-green accent
      secondary: '#9fc309',    // Darker yellow-green
      hover: '#d2e833',        // Brighter yellow-green for hover states
    },
    
    // Status/alert colors
    success: '#4caf50',        // Green for success/positive indicators
    warning: '#ff9800',        // Orange for warnings/cautions
    error: '#f44336',          // Red for errors/negatives
    info: '#2196f3',           // Blue for information/neutral alerts
    
    // Chart colors for data visualization
    chart: [
      '#c3e61c',              // Primary accent (yellow-green)
      '#00bcd4',              // Cyan
      '#ff9800',              // Orange
      '#7e57c2',              // Purple
      '#26a69a',              // Teal
    ],
  },
  
  // Typography settings
  typography: {
    fontFamily: "'Roboto', 'Segoe UI', system-ui, sans-serif",
    
    // Heading sizes
    heading: {
      h1: '2rem',             // 32px
      h2: '1.5rem',           // 24px
      h3: '1.25rem',          // 20px
      h4: '1.125rem',         // 18px
      fontWeight: 500,        // Medium weight for headings
    },
    
    // Body text sizes
    body: {
      small: '0.875rem',      // 14px
      regular: '1rem',        // 16px
      large: '1.125rem',      // 18px
    },
  },
  
  // Spacing scale
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  // Border radii
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    pill: '999px',
  },
  
  // Shadows
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.2)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.3)',
    large: '0 8px 16px rgba(0, 0, 0, 0.4)',
  },
  
  // Transitions
  transitions: {
    fast: 'all 0.2s ease',
    medium: 'all 0.3s ease',
    slow: 'all 0.5s ease',
  },
  
  // Common component styles
  components: {
    input: {
      background: 'rgba(0, 0, 0, 0.2)',
      border: '1px solid #364048',
      color: '#ffffff',
      focus: {
        borderColor: '#c3e61c',
      }
    },
    button: {
      primary: {
        background: '#c3e61c',
        color: '#121c23',
      }
    },
  }
};

// Common reusable styles
export const commonStyles = {
  card: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    boxShadow: theme.shadows.small,
    border: `1px solid ${theme.colors.background.accent}`,
  },
  
  cardHeader: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.heading.h3,
    marginBottom: theme.spacing.md,
    position: "relative",
    paddingLeft: theme.spacing.md,
    display: "flex",
    alignItems: "center",
  },
  
  cardHeaderAccent: {
    width: "3px",
    height: "20px",
    backgroundColor: theme.colors.accent.primary,
    position: "absolute",
    left: "0",
    borderRadius: theme.borderRadius.small,
  },
  
  flexRow: {
    display: "flex", 
    flexWrap: "wrap", 
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  
  flexColumn: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.md,
  },
  
  badge: {
    display: "inline-block",
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.borderRadius.small,
    fontSize: "12px",
    fontWeight: 500,
  },
  
  button: {
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.small,
    border: "none",
    cursor: "pointer",
    transition: theme.transitions.fast,
    fontWeight: 500,
  },
  
  input: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.small,
    border: theme.components.input.border,
    backgroundColor: theme.components.input.background,
    color: theme.components.input.color,
    width: "100%",
    transition: theme.transitions.fast,
  },
  
  formGroup: {
    marginBottom: theme.spacing.md,
  },
  
  formLabel: {
    display: "block",
    marginBottom: theme.spacing.xs,
    color: theme.colors.text.secondary,
  },
};