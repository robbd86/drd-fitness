export const theme = {
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  borderRadius: {
    small: "4px",
    medium: "8px",
    large: "12px",
    pill: "50px",
    circle: "50%",
  },
  colors: {
    text: {
      primary: "#FFFFFF",
      secondary: "#CCCCCC",
      tertiary: "#999999",
      light: "#FFFFFF",
      dark: "#333333",
    },
    background: {
      primary: "#1A1E2E",
      secondary: "#252A3D",
      tertiary: "#2D324A",
      accent: "#212435",
      card: "#252A3D",
    },
    accent: {
      primary: "#34D399", // Vibrant green from image
      secondary: "#10B981", // Darker green for hover states
      success: "#4caf50",
      warning: "#ff9800",
      danger: "#f44336",
      primaryTransparent: "rgba(52, 211, 153, 0.2)",
    },
    success: "#34D399",
    error: "#EF4444",
    warning: "#F59E0B",
    divider: "rgba(255, 255, 255, 0.1)",
  },
  shadows: {
    small: "0 2px 4px rgba(0, 0, 0, 0.3)",
    medium: "0 4px 8px rgba(0, 0, 0, 0.4)",
    large: "0 8px 16px rgba(0, 0, 0, 0.5)",
    inner: "inset 0 2px 4px rgba(0, 0, 0, 0.3)",
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    heading: {
      h1: "32px",
      h2: "24px",
      h3: "18px",
      h4: "16px",
      h5: "14px",
    },
    body: {
      small: "12px",
      medium: "14px",
      large: "16px",
    },
    text: {
      xs: "10px",
      sm: "12px",
      md: "14px",
      lg: "16px",
      xl: "20px",
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  transitions: {
    fast: "all 0.2s ease",
    medium: "all 0.3s ease",
    slow: "all 0.5s ease",
  },
  components: {
    button: {
      primary: {
        background: "#34D399",
        color: "#FFFFFF",
        hoverBackground: "#10B981",
      },
      secondary: {
        background: "transparent",
        color: "#34D399",
        border: "1px solid #34D399",
        hoverBackground: "rgba(52, 211, 153, 0.1)",
      },
    },
    input: {
      border: "1px solid rgba(255, 255, 255, 0.1)",
      background: "rgba(255, 255, 255, 0.05)",
      color: "#FFFFFF",
      placeholder: "#999999",
      focus: {
        border: "1px solid #34D399",
        shadow: "0 0 0 2px rgba(52, 211, 153, 0.2)",
      },
    },
    card: {
      background: "#252A3D",
      border: "1px solid rgba(255, 255, 255, 0.05)",
      shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    nav: {
      background: "#1A1E2E",
      activeColor: "#34D399",
      inactiveColor: "#CCCCCC",
    },
  },
};

export const commonStyles = {
  container: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.primary,
    color: theme.colors.text.primary,
    borderRadius: theme.borderRadius.medium,
  },
  card: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.lg,
    boxShadow: theme.shadows.medium,
  },
  button: {
    primary: {
      backgroundColor: theme.colors.accent.primary,
      color: theme.colors.text.light,
      borderRadius: theme.borderRadius.pill,
      padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
      border: "none",
      cursor: "pointer",
      fontWeight: theme.typography.fontWeight.semibold,
      transition: theme.transitions.fast,
    },
    secondary: {
      backgroundColor: "transparent",
      color: theme.colors.accent.primary,
      borderRadius: theme.borderRadius.pill,
      padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
      border: `1px solid ${theme.colors.accent.primary}`,
      cursor: "pointer",
      fontWeight: theme.typography.fontWeight.semibold,
      transition: theme.transitions.fast,
    },
  },
  form: {
    input: {
      width: "100%",
      padding: theme.spacing.md,
      backgroundColor: theme.components.input.background,
      color: theme.components.input.color,
      border: theme.components.input.border,
      borderRadius: theme.borderRadius.medium,
      outline: "none",
    },
  },
};
